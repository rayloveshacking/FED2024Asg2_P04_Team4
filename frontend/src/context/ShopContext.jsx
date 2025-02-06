// /src/context/ShopContext.jsx
import { createContext, useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, setDoc, orderBy } from "firebase/firestore"; //This is to import firestore methods to create queries, listen for updates and update documents.
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth"; //This is to import firebase authentication methods to listen for auth state changes.

export const ShopContext = createContext(); //This is to create a new context to be used through out the app.

const ShopContextProvider = (props) => { //This will wraps around child components and provides global state.
  const [products, setProducts] = useState([]); //This is the state to store new products fetched from firestore.
  const [refurbishedProducts, setRefurbishedProducts] = useState([]); //This is the state to store refurbished products fetched from firestore.
  const currency = "$"; //This is the constant for currency symbol.
  const delivery_fee = 10; //This is the constant for delivery fee.
  const [search, setSearch] = useState(""); //This is the state to store the search query entered by the user.
  const [showSearch, setShowSearch] = useState(false); //This is the state to control whether the search bar is displayed.

  // --- Cart state and user-specific implementation ---
  const [cart, setCart] = useState([]); //This is the state to hold the user's cart items.
  const [currentUser, setCurrentUser] = useState(null); //This is the state to store the current authenticated user.
  const auth = getAuth(); //To get the firebase authenticated instance.

  // Listen for authentication changes and load user's cart
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const cartDocRef = doc(db, "carts", user.uid); //This is to reference the user's cart document in the "carts" collection.
        const unsubscribeCart = onSnapshot(cartDocRef, (docSnap) => { //This is to listen for real time updates to the user's cart.
          if (docSnap.exists()) {
            setCart(docSnap.data().items); //If the cart document exists, update the cart state with the items.
          } else {
            setCart([]); //Otherwise set the cart to an empty array.
          }
        });
        return () => unsubscribeCart(); //This is to clean up the cart listener when the user changes or component unmounts.
      } else {
        setCart([]); //If no user is authenticated, clear the cart.
      }
    });
    return () => unsubscribeAuth(); //This is to clean up the authentication listener on component unmount.
  }, [auth]);

  // Helper function to update the Firestore cart document for the current user
  const updateCartInFirestore = async (newCart) => {
    if (currentUser) {
      const cartDocRef = doc(db, "carts", currentUser.uid); //This is to get a reference to the user's cart document.
      await setDoc(cartDocRef, { items: newCart }); //This will update the document with the new cart items.
    }
  };

  const addToCart = async (product) => { //This is the function to add a product to the cart, checks if the product already exists in the cart and increase quantity or add a new entry.
    const existingProduct = cart.find((item) => item.id === product.id);
    let newCart;
    if (existingProduct) {
      newCart = cart.map((item) => //If it exists, map over the cart and increment the quantity
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }]; //If not, add the item to the cart with initial quantity of 1.
    }
    setCart(newCart); //This is to update the local state.
    await updateCartInFirestore(newCart); //This will update the firestore cart document.
  };

  const removeFromCart = async (productId) => { //This is the function to remove a product from the cart.
    const newCart = cart.filter((item) => item.id !== productId); 
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  const updateCartQuantity = async (productId, quantity) => { //This is the function to update the quantity of a product in the cart.
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  // New clearCart function to remove all items after checkout, inserts the local cart state and updates the firestore document.
  const clearCart = async () => {
    setCart([]);
    if (currentUser) {
      const cartDocRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartDocRef, { items: [] });
    }
  };

  // --- Firestore queries for products with expiry filter and bump ordering ---
  useEffect(() => {
    const currentDate = new Date();

    // For new products, order first by bump value (desc) then by listDate (desc)
    const qNew = query(
      collection(db, "products"),
      where("type", "==", "new"),
      where("expiryDate", ">", currentDate),
      orderBy("bump", "desc"),
      orderBy("listDate", "desc")
    );
    const unsubNew = onSnapshot(qNew, (snapshot) => { //Listen for real time updates to new products.
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // For refurbished products, similarly order by bump value and then listDate
    const qRefurb = query(
      collection(db, "products"),
      where("type", "==", "refurbished"),
      where("expiryDate", ">", currentDate),
      orderBy("bump", "desc"),
      orderBy("listDate", "desc")
    );
    const unsubRefurb = onSnapshot(qRefurb, (snapshot) => { //This is to listen for real time updates to refurbished products.
      setRefurbishedProducts(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => { //This is to clean up the firestore listeners when the component unmounts.
      unsubNew();
      unsubRefurb();
    };
  }, []); //Empty dependency array ensures this effect run only once on mount.

  const value = { //Defines the values and functions to be provided globally via context.
    products,
    refurbishedProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };

  return ( //This is to provided the defined value to all child components.
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
