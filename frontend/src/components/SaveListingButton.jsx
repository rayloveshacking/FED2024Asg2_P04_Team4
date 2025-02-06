// /src/components/SaveListingButton.jsx
import React, { useState, useEffect } from 'react'; //import react and all necessary components
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

const SaveListingButton = ({ productId }) => { //This component allows users to save or unsave a product listing.
  const auth = getAuth(); //This get the current authenticated user.
  const currentUser = auth.currentUser;
  const [isSaved, setIsSaved] = useState(false); //This is the local state to track if the product is saved.
  const [loading, setLoading] = useState(true); //This is the local state to indicate if the saved listings data is still loading.

  useEffect(() => { //This is the use effect hook to fetch the user's saved listings from firestore when the component mounts or when current user or productId changes.
    if (currentUser) {
      const fetchSavedListings = async () => { //This is to define an asynchronous function to fetch saved listings.
        try {
          const userDocRef = doc(db, 'users', currentUser.uid); //This will get a reference to the current user's document in the users collection.
          const docSnap = await getDoc(userDocRef); //This will retrieve the document snapshot.
          if (docSnap.exists()) { //If the document exists, update the isSaved state based on whether the savedListings array includes the provided productId.
            const data = docSnap.data();
            setIsSaved(data.savedListings && data.savedListings.includes(productId));
          }
        } catch (error) {
          console.error("Error fetching saved listings: ", error); //This is to log any errors that occur while fetching the saved listings.
        } finally {
          setLoading(false); //This is to mark loading as complete whether or not the fetch was successful.
        }
      };
      fetchSavedListings(); //This call the function to fetch saved listings.
    } else {
      setLoading(false); //If no user is authenticated, simply mark loading as complete.
    }
  }, [currentUser, productId]);

  const handleToggleSave = async (e) => { //This is the function to handle toggling the saved status for a product.
    // Prevent any parent click (e.g. navigation in a ProductItem)
    e.stopPropagation();
    if (!currentUser) return; //If no user is logged in, do nothing.
    const userDocRef = doc(db, 'users', currentUser.uid); //This will get a reference to the current user's document in firestore.
    try {
      if (isSaved) { //If the product is already saved, remove it from the savedListings array.
        await updateDoc(userDocRef, {
          savedListings: arrayRemove(productId)
        });
      } else {
        await updateDoc(userDocRef, { //Otherwise add the productId to the savedListings array.
          savedListings: arrayUnion(productId)
        });
      }
      setIsSaved(!isSaved); //This is to toggle the local isSaved state to reflect the change.
    } catch (error) {
      console.error("Error updating saved listings: ", error);
    }
  };

  if (loading) { //If the data is still loading, display a loading button.
    return <button className="bg-gray-300 text-white px-2 py-1 rounded text-xs">...</button>;
  }

  return ( //This will render the save or unsave button.
    <button onClick={handleToggleSave} className="bg-red-500 text-white px-2 py-1 rounded text-xs">
      {isSaved ? "Unsave" : "Save"}
    </button>
  );
};

export default SaveListingButton;
