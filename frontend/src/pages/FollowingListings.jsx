import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ProductItem from '../components/ProductItem';

const FollowingListings = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [following, setFollowing] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchFollowing = async () => {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFollowing(data.following || []);
        }
      };
      fetchFollowing();
    }
  }, [currentUser]);

  useEffect(() => {
    if (following.length > 0) {
      // Firestore 'in' queries support up to 10 values. If you have more, you may need to adjust.
      const q = query(
        collection(db, "products"),
        where("sellerId", "in", following.slice(0, 10)),
        where("expiryDate", ">", new Date())
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } else {
      setListings([]);
    }
  }, [following]);

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">New Listings from Sellers You Follow</h2>
      {listings.length === 0 ? (
        <p>No new listings from followed sellers.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {listings.map(item => (
            <ProductItem
              key={item.id}
              id={item.id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowingListings;
