// /src/components/BumpListing.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const BumpListing = ({ productId }) => {
  const [selectedBump, setSelectedBump] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('');

  // Define available bump options.
  const bumpOptions = [
    { label: 'Basic Bump (+1)', value: 1, price: 5 },
    { label: 'Premium Bump (+3)', value: 3, price: 10 },
    { label: 'Ultimate Bump (+5)', value: 5, price: 15 },
  ];

  const handleBumpPurchase = async () => {
    if (!selectedBump) return;
    setProcessing(true);
    setMessage('');

    try {
      // (Optional) Insert payment processing logic here.

      // Retrieve the current bump value.
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);
      let currentBump = 0;
      if (productSnap.exists()) {
        currentBump = productSnap.data().bump || 0;
      }
      // Update the product's bump field.
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
      <h3 className="text-lg font-bold mb-2">Promote Your Listing</h3>
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
      <button
        onClick={handleBumpPurchase}
        disabled={processing || !selectedBump}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        {processing ? 'Processing...' : 'Purchase Bump'}
      </button>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default BumpListing;
