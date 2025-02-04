import { createContext, useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [refurbishedProducts, setRefurbishedProducts] = useState([]);
  const currency = "$";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // --- Cart state and user-specific implementation ---
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();

  // Listen for authentication changes and load user's cart
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const cartDocRef = doc(db, "carts", user.uid);
        const unsubscribeCart = onSnapshot(cartDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setCart(docSnap.data().items);
          } else {
            setCart([]);
          }
        });
        return () => unsubscribeCart();
      } else {
        setCart([]);
      }
    });
    return () => unsubscribeAuth();
  }, [auth]);

  // Helper function to update the Firestore cart document for the current user
  const updateCartInFirestore = async (newCart) => {
    if (currentUser) {
      const cartDocRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartDocRef, { items: newCart });
    }
  };

  const addToCart = async (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    let newCart;
    if (existingProduct) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  const removeFromCart = async (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  const updateCartQuantity = async (productId, quantity) => {
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  // New clearCart function to remove all items after checkout
  const clearCart = async () => {
    setCart([]);
    if (currentUser) {
      const cartDocRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartDocRef, { items: [] });
    }
  };

  // --- Firestore queries for products with expiry filter ---
  useEffect(() => {
    const currentDate = new Date();
    const qNew = query(
      collection(db, "products"),
      where("type", "==", "new"),
      where("expiryDate", ">", currentDate)
    );
    const unsubNew = onSnapshot(qNew, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const qRefurb = query(
      collection(db, "products"),
      where("type", "==", "refurbished"),
      where("expiryDate", ">", currentDate)
    );
    const unsubRefurb = onSnapshot(qRefurb, (snapshot) => {
      setRefurbishedProducts(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {
      unsubNew();
      unsubRefurb();
    };
  }, []);

  const value = {
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

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
