import React, { useState, useEffect } from 'react'; //import react and other necessary components.
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import FollowButton from '../components/FollowButton';
import ProductItem from '../components/ProductItem';

const SellerProfile = () => {
  const { sellerId } = useParams(); //This extract the sellerId from the url params.
  const [seller, setSeller] = useState(null); //This is a local state to hold seller information.
  const [products, setProducts] = useState([]); //This is a local state to hold the list of products.

  // Fetch seller information from the "users" collection
  useEffect(() => {
    const fetchSeller = async () => { //Asynchronous function to fetch seller date.
      const sellerDocRef = doc(db, "users", sellerId); //Get a reference to the seller's document in firestore.
      const docSnap = await getDoc(sellerDocRef); //Retrieve the seller's document snapshot.
      if (docSnap.exists()) { // If document exists, update the seller state with the document data.
        setSeller(docSnap.data());
      }
    };
    fetchSeller(); //Call the function to fetch seller information.
  }, [sellerId]); //Rerun the effect if sellerId Changes.

  // Fetch the seller's product listings (only non-expired listings)
  useEffect(() => {
    const q = query( //build the firestore query to get products that belong to this seller and expirydate is greater than the current date.
      collection(db, "products"),
      where("sellerId", "==", sellerId),
      where("expiryDate", ">", new Date())
    );
    const unsubscribe = onSnapshot(q, (snapshot) => { //Set up a real time listener for the query.
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); //Map over the snapshot to build an array of products and update state.
    });
    return () => unsubscribe(); //This clean up the listener when the component unmounts or sellerId changes.
  }, [sellerId]);

  if (!seller) return <div>Loading seller information...</div>; //If the seller information is not loaded yet, render a loading message.

  return ( //Main controller for the seller profile page, centered with a maximum width.
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{seller.name}</h2>
          <p>Email: {seller.email}</p>
        </div>
        <FollowButton sellerId={sellerId} />
      </div>
      <h3 className="text-2xl mt-6 mb-4">Seller's Listings</h3>
      {products.length === 0 ? (
        <p>No listings from this seller.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductItem //Render a productItem component for each product, the productId is used as a key.
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

export default SellerProfile;
