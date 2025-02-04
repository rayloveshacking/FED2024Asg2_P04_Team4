import React, { useState } from 'react';
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";

const CheckoutModal = ({ cart, totalPrice, onClose, clearCart }) => {
  const [creditCard, setCreditCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const auth = getAuth();

  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // Simulate successful payment by creating an order in Firestore
        await addDoc(collection(db, "orders"), {
          userId: auth.currentUser.uid,
          items: cart,
          total: totalPrice,
          createdAt: serverTimestamp()
        });
        setMessage("Payment successful!");
        // Clear the cart since the order has been paid for
        await clearCart();
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        setMessage("Error creating order. Try again.");
      }
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>
        <form onSubmit={handleCheckout}>
          <input
            type="text"
            placeholder="Credit Card Number"
            value={creditCard}
            onChange={(e) => setCreditCard(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="Expiry (MM/YY)"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mt-2"
            disabled={processing}
          >
            {processing ? "Processing..." : "Confirm Payment"}
          </button>
        </form>
        {message && <p className="mt-2 text-green-600">{message}</p>}
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
