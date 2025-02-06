import React, { useState } from 'react';
import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore"; //This will import firestore methods to create documents and timestamps.
import { db } from "../firebase"; //This will import the firebase database.
import { getAuth } from "firebase/auth"; //This will import authentication methods from firebase.

const CheckoutModal = ({ cart, totalPrice, onClose, clearCart }) => {
  const [creditCard, setCreditCard] = useState(""); //This is the local state for storing the credit card information.
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false); //This is the state to indicate whether the payment process is happening.
  const [message, setMessage] = useState(""); //This is the state for storing any success or error messages to display to the user.
  const auth = getAuth(); //This will get the current authenticated user.

  const handleCheckout = async (e) => { //This is the function to handle the checkout process when the form is submitted.
    e.preventDefault(); //This is to prevent from submitting the default form
    setProcessing(true); //This set processing to true to disable form inputs and button.

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
        await clearCart(); //After a short delay close the checkout modal.
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) { //If an error occurs during the order creation, display the error message.
        setMessage("Error creating order. Try again.");
      }
      setProcessing(false); //This is to reset the processing state.
    }, 1500); //set 1500ms delay simulating payment processing.
  };

  return (
    //Modal Overlay to cover the entire view port with a semi transparent background.
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
