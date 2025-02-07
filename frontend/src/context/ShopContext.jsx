// /src/context/ShopContext.jsx
import { createContext, useState, useEffect } from "react"; //import react for managing state and side effects.
import { //import firestore methods for data querying, realtime updates and document updates.
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  orderBy,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const ShopContext = createContext();

const ShopContextProvider = (props) => { //To Wrap the application and provides global state to all child components.
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

  // New: Rewards state (coins and achievements)
  const [rewards, setRewards] = useState({ points: 0, achievements: [] });

  // Listen for auth changes and load user's cart and rewards
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
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeRewards = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRewards({
              points: data.points || 0,
              achievements: data.achievements || [],
            });
          }
        });
        return () => {
          unsubscribeCart();
          unsubscribeRewards();
        };
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

  const addToCart = async (product) => { //This is the function to add a product to the cart.
    const existingProduct = cart.find((item) => item.id === product.id);
    let newCart;
    if (existingProduct) { //Condition check if product is already in the cart.
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  const removeFromCart = async (productId) => { //This is the function to remove a product from the cart by it's ID.
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  const updateCartQuantity = async (productId, quantity) => { //This is the function to update the quantity of a specific product in the cart.
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    await updateCartInFirestore(newCart);
  };

  const clearCart = async () => { //This is the function to clear the entire cart.
    setCart([]);
    if (currentUser) {
      const cartDocRef = doc(db, "carts", currentUser.uid);
      await setDoc(cartDocRef, { items: [] });
    }
  };

  // New: Award coins based on purchase total.
  // Award 100 coins for every $1000 spent (rounded down).
  const addRewardCoins = async (totalPrice) => {
    if (currentUser) {
      const coinsAwarded = Math.floor(totalPrice / 1000) * 100;
      if (coinsAwarded > 0) {
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          await updateDoc(userDocRef, {
            points: (rewards.points || 0) + coinsAwarded,
          });
          setRewards((prev) => ({
            ...prev,
            points: (prev.points || 0) + coinsAwarded,
          }));
        } catch (err) {
          console.error("Error updating reward coins: ", err);
        }
      }
    }
  };

  // New: Deduct coins when a user purchases with coins.
  const deductRewardCoins = async (coinsToDeduct) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      try {
        const newTotal = Math.max((rewards.points || 0) - coinsToDeduct, 0);
        await updateDoc(userDocRef, {
          points: newTotal,
        });
        setRewards((prev) => ({ ...prev, points: newTotal }));
      } catch (err) {
        console.error("Error deducting coins: ", err);
      }
    }
  };

  // New: Award an achievement if not already awarded.
  const awardAchievement = async (achievement) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const currentAchievements = rewards.achievements || [];
      if (!currentAchievements.includes(achievement)) {
        try {
          await updateDoc(userDocRef, {
            achievements: arrayUnion(achievement),
          });
          setRewards((prev) => ({
            ...prev,
            achievements: [...(prev.achievements || []), achievement],
          }));
        } catch (err) {
          console.error("Error awarding achievement: ", err);
        }
      }
    }
  };

  // --- Firestore queries for products with expiry filter and bump ordering ---
  useEffect(() => {
    const currentDate = new Date();
    const qNew = query(
      collection(db, "products"),
      where("type", "==", "new"),
      where("expiryDate", ">", currentDate),
      orderBy("bump", "desc"),
      orderBy("listDate", "desc")
    );
    const unsubNew = onSnapshot(qNew, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const qRefurb = query(
      collection(db, "products"),
      where("type", "==", "refurbished"),
      where("expiryDate", ">", currentDate),
      orderBy("bump", "desc"),
      orderBy("listDate", "desc")
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
    rewards,           // Expose rewards (coins and achievements)
    addRewardCoins,    // Function to award coins per purchase
    deductRewardCoins, // Function to deduct coins when purchasing with coins
    awardAchievement,  // Function to award achievements
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
