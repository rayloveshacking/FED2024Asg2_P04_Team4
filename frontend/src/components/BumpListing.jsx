// /src/components/BumpListing.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const BumpListing = ({ productId }) => {
  //State for selected bump option (the value indicates the bump increment)
  const [selectedBump, setSelectedBump] = useState('');
  //State for credit card information
  const [creditCard, setCreditCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  //State to indicate whether payment is being processed
  const [processing, setProcessing] = useState(false);
  //State to hold any success or error messages
  const [message, setMessage] = useState('');

  //Available bump options with corresponding price
  const bumpOptions = [
    { label: 'Basic Bump (+1)', value: 1, price: 5 },
    { label: 'Premium Bump (+3)', value: 3, price: 10 },
    { label: 'Ultimate Bump (+5)', value: 5, price: 15 },
  ];

  //Function to handle the bump purchase process
  const handleBumpPurchase = async () => {
    //Ensure a bump option has been selected
    if (!selectedBump) return;

    //Check if credit card details have been provided.
    if (!creditCard || !expiry || !cvv) {
      setMessage('Please enter your credit card details.');
      return;
    }

    setProcessing(true);
    setMessage('');

    try {
      // Here there could be a payment processing logic.
      //Retrieve the current bump value from the product document.
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);
      let currentBump = 0;
      if (productSnap.exists()) {
        currentBump = productSnap.data().bump || 0;
      }
      //Update the product's bump field in Firestore by adding the selected bump value.
      await updateDoc(productRef, {
        bump: currentBump + Number(selectedBump)
      });
      setMessage('Listing bumped successfully!');
    } catch (error) {
      console.error("Error bumping listing:", error);
      setMessage('Error bumping listing. Please try again.');
    }
    setProcessing(false);
  };

  return (
    <div className="p-4 border rounded shadow bg-white mt-2">
      {/*Section Header */}
      <h3 className="text-lg font-bold mb-2">Promote Your Listing</h3>
      
      {/*Dropdown for selecting bump option */}
      <select
        value={selectedBump}
        onChange={(e) => setSelectedBump(e.target.value)}
        className="p-2 border rounded w-full mb-3"
      >
        <option value="">Select Bump Option</option>
        {bumpOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label} - ${option.price}
          </option>
        ))}
      </select>

      {/*Credit Card Information Section */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Credit Card Number"
          value={creditCard}
          onChange={(e) => setCreditCard(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Expiry (MM/YY)"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
      </div>

      {/*Button to initiate the bump purchase process */}
      <button
        onClick={handleBumpPurchase}
        disabled={processing || !selectedBump}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        {processing ? 'Processing...' : 'Purchase Bump'}
      </button>
      
      {/*Display success or error message */}
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default BumpListing;
