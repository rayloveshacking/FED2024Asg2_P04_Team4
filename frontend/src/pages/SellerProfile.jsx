import React, { useState, useEffect } from 'react'; //import react and other neccessary components.
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import FollowButton from '../components/FollowButton';
import ProductItem from '../components/ProductItem';
import { getAuth } from 'firebase/auth';

const SellerProfile = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  // Compute conversationId based on the current user and seller IDs.
  // Sort the two IDs so the conversation id is consistent regardless of who initiates.
  const conversationId = currentUser
    ? [currentUser.uid, sellerId].sort().join('_')
    : null;

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

  // Fetch the seller's product listings (only non-expired listings)
  useEffect(() => {
    const q = query(
      collection(db, "products"),
      where("sellerId", "==", sellerId),
      where("expiryDate", ">", new Date())
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [sellerId]);

  if (!seller) return <div>Loading seller information...</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold">{seller.name}</h2>
          <p>Email: {seller.email}</p>
        </div>
        <div className="flex space-x-4">
          <FollowButton sellerId={sellerId} />
          {/* Updated Chat Button */}
          {currentUser ? (
            <Link
              to={`/chats/${conversationId}`}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Chat with Seller
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Login to Chat
            </Link>
          )}
        </div>
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
