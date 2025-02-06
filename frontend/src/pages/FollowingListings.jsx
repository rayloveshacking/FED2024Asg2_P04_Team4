import React, { useEffect, useState } from 'react'; //import necessary components
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ProductItem from '../components/ProductItem';

const FollowingListings = () => {
  const auth = getAuth(); //Initialize firebase auth and get the current user.
  const currentUser = auth.currentUser;
  const [following, setFollowing] = useState([]); //This is a state to store the list of seller IDs that the current user is following.
  const [listings, setListings] = useState([]); //This is the state to store the product listings fetched from sellers that the user follows.

  useEffect(() => { //This useEffect is to fetch the list of sellers that the current user is following.
    if (currentUser) {
      const fetchFollowing = async () => { //This defines an asynchronous function to fetch the following list.
        const userDocRef = doc(db, "users", currentUser.uid); //This reference the current user's document in the "users" collection.
        const docSnap = await getDoc(userDocRef); //This is to fetch the user's document snapshot.
        if (docSnap.exists()) { //If the document does not exist, default to an empty array.
          const data = docSnap.data();
          setFollowing(data.following || []);
        }
      };
      fetchFollowing(); //Call the asynchronous function.
    }
  }, [currentUser]);

  useEffect(() => { //This useeffect is to fetch the product listings
    if (following.length > 0) {
      // Firestore 'in' queries support up to 10 values. If you have more, you may need to adjust.
      const q = query(
        collection(db, "products"),
        where("sellerId", "in", following.slice(0, 10)), //Filter products whose sellerId is in the following list
        where("expiryDate", ">", new Date()) //Filter out expired products.
      );
      const unsubscribe = onSnapshot(q, (snapshot) => { // Listen for real time updates to query results
        setListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); //This map over the query snapshot to extract product data and update the listings state.
      });
      return () => unsubscribe(); //This clean up the snapshot listener when the component unmounts or when the dependency changes.
    } else {
      setListings([]); // If there are no followed sellers, clear the listings.
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
              key={item.id} //Product id is used as the key.
              id={item.id} //Product id is passed to the product item component.
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
