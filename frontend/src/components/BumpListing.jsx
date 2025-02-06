// /src/components/BumpListing.jsx
import React, { useState } from 'react';
import { db } from '../firebase'; //Import firebase database instance.
import { doc, updateDoc, getDoc } from 'firebase/firestore'; //import firestore methods to interact with documents.

const BumpListing = ({ productId }) => {
  const [selectedBump, setSelectedBump] = useState(''); //local state to store the currently selected bump value.
  const [processing, setProcessing] = useState(false); //state to indicate whether the bump purchase process is ongoing.
  const [message, setMessage] = useState(''); //state to hold any success or error messages to display to the user.

  // Define available bump options.
  const bumpOptions = [ //Each option include a label to display, a numeric value and a price.
    { label: 'Basic Bump (+1)', value: 1, price: 5 },
    { label: 'Premium Bump (+3)', value: 3, price: 10 },
    { label: 'Ultimate Bump (+5)', value: 5, price: 15 },
  ];

  const handleBumpPurchase = async () => { //This function handles the bump purchase process. It retrieves the bump value from firestore and updates it by adding the selected bump.
    if (!selectedBump) return; //If no bump option is selected, this will exit the function early.
    setProcessing(true); //This sets the processing state to true to disable interactions during the operation.
    setMessage(''); //This will clear any previous messages.

    try {
      // (Optional) Insert payment processing logic here.

      // Retrieve the current bump value.
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef); //This will fetch the current data of the product.
      let currentBump = 0; //This initializes the current bump value, if not set default is 0.
      if (productSnap.exists()) {
        currentBump = productSnap.data().bump || 0;
      }
      // Update the product's bump field in firestore.
      await updateDoc(productRef, {
        bump: currentBump + Number(selectedBump)
      });
      setMessage('Listing bumped successfully!'); //This will set a sucess messsage indicating the listing has been bumped.
    } catch (error) {
      console.error("Error bumping listing:", error); //This will log any errors to the console for debugging.
      setMessage('Error bumping listing. Please try again.'); //This will set an error message to inform the issue.
    }
    setProcessing(false); //This will reset the processing state to false when the operation is complete.
  };

  return (
    <div className="p-4 border rounded shadow bg-white mt-2"> 
      {/* This is the header for bump listing section*/}
      <h3 className="text-lg font-bold mb-2">Promote Your Listing</h3> 
      {/* This is the dropdown to select a bump option*/}
      <select
        value={selectedBump}
        onChange={(e) => setSelectedBump(e.target.value)}
        className="p-2 border rounded w-full mb-3"
      >
        <option value="">Select Bump Option</option>
        {/*This will map over bumpOptions to create an <option> for each available bump. */}
        {bumpOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label} - ${option.price}
          </option>
        ))}
      </select>
      {/* This is the button to initiate the bump purchase.*/}
      <button
        onClick={handleBumpPurchase}
        disabled={processing || !selectedBump}
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
      >
        {processing ? 'Processing...' : 'Purchase Bump'}
      </button>
      {/* This will display any success or error messages*/}
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default BumpListing;
