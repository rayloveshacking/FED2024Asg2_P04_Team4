// /src/pages/SellerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import FollowButton from '../components/FollowButton';
import ProductItem from '../components/ProductItem';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch seller information from the "users" collection
  useEffect(() => {
    const fetchSeller = async () => {
      const sellerDocRef = doc(db, "users", sellerId);
      const docSnap = await getDoc(sellerDocRef);
      if (docSnap.exists()) {
        setSeller(docSnap.data());
      }
    };
    fetchSeller();
  }, [sellerId]);

  // Fetch the seller's product listings from the "products" collection
  useEffect(() => {
    const q = query(collection(db, "products"), where("sellerId", "==", sellerId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [sellerId]);

  if (!seller) return <div>Loading seller information...</div>;

  return (
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

export default SellerProfile;
