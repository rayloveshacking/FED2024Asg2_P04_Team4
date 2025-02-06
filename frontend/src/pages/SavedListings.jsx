// /src/pages/SavedListings.jsx
import React, { useState, useEffect } from 'react'; //import react and other necessary components.
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, documentId } from 'firebase/firestore';
import { db } from '../firebase';
import ProductItem from '../components/ProductItem';

const SavedListings = () => {
  const auth = getAuth(); //This initializes firebase auth and get the current authenticated user.
  const currentUser = auth.currentUser;
  const [savedIds, setSavedIds] = useState([]); //This is a state to hold the array of saved listing IDs retrieved from the user's document.
  const [products, setProducts] = useState([]); //This is a state to hold the product data corresponding to the saved listings.

  useEffect(() => { //This useeffect fetch the list of saved listing IDs from the user's firestore document and run whenever the current user changes.
    if (currentUser) {
      const fetchSavedListings = async () => { //This is an asychronous function to fetch the saved listings.
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) { //Chech whether or not the document exists and if exists, update savedIds state with the savedListings array, if not default to empty array.
          const data = docSnap.data();
          setSavedIds(data.savedListings || []);
        }
      };
      fetchSavedListings(); //This call the asynchronous function to fetch saved listing IDs.
    }
  }, [currentUser]);

  useEffect(() => { //This is a useeffect to fetch product details for each saved listing ID and run whenever the savedIds state changes.
    if (savedIds.length > 0) {
      // Firestore "in" queries support up to 10 values. (For more, consider paginating or using multiple queries.)
      const limitedSavedIds = savedIds.slice(0, 10);
      const q = query( //This create a firestore query to fetch products whose document ID is in the limitedSavedIds array.
        collection(db, "products"),
        where(documentId(), "in", limitedSavedIds)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => { //This listen for real time updates to the query results.
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); //This map over the documents in the snapshot and update the products state.
      });
      return () => unsubscribe(); //This clean up the listener when the effect is rerun or the component unmounts.
    } else {
      setProducts([]); // Check if saved IDs exist, if not ensure that products state is set to an empty array.
    }
  }, [savedIds]);

  return ( //Main container for the Saved Listings page with centered content.
    <div className="max-w-4xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Saved Listings</h2>
      {products.length === 0 ? (
        <p>You have no saved listings.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductItem
              key={product.id}
              id={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedListings;
