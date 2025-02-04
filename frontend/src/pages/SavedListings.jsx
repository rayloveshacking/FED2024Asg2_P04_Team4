// /src/pages/SavedListings.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, documentId } from 'firebase/firestore';
import { db } from '../firebase';
import ProductItem from '../components/ProductItem';

const SavedListings = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [savedIds, setSavedIds] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchSavedListings = async () => {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSavedIds(data.savedListings || []);
        }
      };
      fetchSavedListings();
    }
  }, [currentUser]);

  useEffect(() => {
    if (savedIds.length > 0) {
      // Firestore "in" queries support up to 10 values. (For more, consider paginating or using multiple queries.)
      const limitedSavedIds = savedIds.slice(0, 10);
      const q = query(
        collection(db, "products"),
        where(documentId(), "in", limitedSavedIds)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } else {
      setProducts([]);
    }
  }, [savedIds]);

  return (
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
