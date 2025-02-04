// /src/components/SaveListingButton.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

const SaveListingButton = ({ productId }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchSavedListings = async () => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsSaved(data.savedListings && data.savedListings.includes(productId));
          }
        } catch (error) {
          console.error("Error fetching saved listings: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSavedListings();
    } else {
      setLoading(false);
    }
  }, [currentUser, productId]);

  const handleToggleSave = async (e) => {
    // Prevent any parent click (e.g. navigation in a ProductItem)
    e.stopPropagation();
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      if (isSaved) {
        await updateDoc(userDocRef, {
          savedListings: arrayRemove(productId)
        });
      } else {
        await updateDoc(userDocRef, {
          savedListings: arrayUnion(productId)
        });
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error updating saved listings: ", error);
    }
  };

  if (loading) {
    return <button className="bg-gray-300 text-white px-2 py-1 rounded text-xs">...</button>;
  }

  return (
    <button onClick={handleToggleSave} className="bg-red-500 text-white px-2 py-1 rounded text-xs">
      {isSaved ? "Unsave" : "Save"}
    </button>
  );
};

export default SaveListingButton;
