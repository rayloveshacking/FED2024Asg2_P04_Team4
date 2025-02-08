// /src/components/PointsCheckoutModal.jsx
import React, { useState, useContext } from 'react'; //import react and other necessary components.
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { ShopContext } from "../context/ShopContext";

const PointsCheckoutModal = ({ cart, totalPrice, onClose, clearCart }) => { //Different states to hold different datas
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const auth = getAuth();
  const { rewards, deductRewardCoins } = useContext(ShopContext);

  const handlePointsCheckout = async () => {
    setProcessing(true);
    setMessage("");
    // Assume a 1:1 conversion rate: user must have coins >= totalPrice
    if (rewards.points < totalPrice) {
      setMessage("Insufficient coins to complete this purchase.");
      setProcessing(false);
      return;
    }
    try {
      // Create an order using coins
      await addDoc(collection(db, "orders"), {
        userId: auth.currentUser.uid,
        items: cart,
        total: totalPrice,
        paidWithCoins: true,
        createdAt: serverTimestamp()
      });
      // Deduct coins equal to totalPrice
      await deductRewardCoins(totalPrice);
      setMessage("Purchase successful using coins!");
      await clearCart();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error processing coin checkout:", error);
      setMessage("Error processing purchase. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Checkout with Coins</h2>
        <p className="mb-4">Total Price: ${totalPrice}</p>
        <p className="mb-4">Your Coins: {rewards.points}</p>
        {message && <p className="mb-2 text-green-600">{message}</p>}
        <button
          onClick={handlePointsCheckout}
          disabled={processing}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {processing ? "Processing..." : "Confirm Purchase"}
        </button>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 underline w-full">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PointsCheckoutModal;
