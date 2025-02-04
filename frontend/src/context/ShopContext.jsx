// /src/context/ShopContext.jsx
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

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Listen to the cart document for the logged-in user
        const cartDocRef = doc(db, "carts", user.uid);
        const unsubscribeCart = onSnapshot(cartDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setCart(docSnap.data().items);
          } else {
            // If no cart document exists, initialize with an empty cart
            setCart([]);
          }
        });
        return () => unsubscribeCart();
      } else {
        // When logged out, clear the cart
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

  // Update addToCart to update both local state and Firestore
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

  // Update removeFromCart to update both local state and Firestore
  const removeFromCart = async (productId) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  // Update updateCartQuantity to update both local state and Firestore
  const updateCartQuantity = async (productId, quantity) => {
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  // --- Firestore queries for products ---
  useEffect(() => {
    const qNew = query(collection(db, "products"), where("type", "==", "new"));
    const unsubNew = onSnapshot(qNew, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const qRefurb = query(
      collection(db, "products"),
      where("type", "==", "refurbished")
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
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
