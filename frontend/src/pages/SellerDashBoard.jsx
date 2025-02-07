// /src/pages/SellerDashBoard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import ProductItem from '../components/ProductItem';
import BumpListing from '../components/BumpListing';

const auth = getAuth(app);

const SellerDashboard = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Computers',
    subCategory: 'Laptops',
    type: 'new',
    image: [] // Cloudinary image URLs
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  // Upload a single image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'unsigned_preset'); // your preset
    data.append('cloud_name', 'dls2ndk2q'); // your cloud name
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dls2ndk2q/image/upload`, data);
      return res.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  };

  // Check active listings limit (only count listings that have not yet expired)
  const checkActiveListingsLimit = async () => {
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', auth.currentUser.uid),
      where('active', '==', true),
      where('expiryDate', '>', new Date())
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Function to send a notification to each follower about a new listing
  const sendNewListingNotification = async (productId, productName) => {
    const followersQuery = query(
      collection(db, "users"),
      where("following", "array-contains", auth.currentUser.uid)
    );
    const followersSnapshot = await getDocs(followersQuery);
    followersSnapshot.forEach(async (docSnap) => {
      const followerId = docSnap.id;
      await addDoc(collection(db, "notifications"), {
        userId: followerId,
        type: "new_listing",
        message: `New product "${productName}" listed by ${auth.currentUser.displayName || "Seller"}.`,
        link: `/product/${productId}`,
        read: false,
        createdAt: serverTimestamp()
      });
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const activeCount = await checkActiveListingsLimit();
      if (activeCount >= 30) {
        throw new Error("You have reached the maximum of 30 active listings.");
      }

      if (!files.length) {
        throw new Error("Please upload at least one image.");
      }

      const uploadedUrls = await Promise.all(files.map(file => uploadImageToCloudinary(file)));
      const now = new Date();
      const expiryDate = Timestamp.fromDate(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)); // 30 days later

      const newProduct = {
        ...product,
        image: uploadedUrls,
        price: Number(product.price),
        sellerId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName || '',
        active: true,
        bump: 0,
        listDate: Timestamp.fromDate(now),
        expiryDate: expiryDate,
        createdAt: serverTimestamp()
      };

      // Add new product and get its reference (to retrieve its ID)
      const productRef = await addDoc(collection(db, 'products'), newProduct);

      setSuccess("Product uploaded successfully!");
      setProduct({
        name: '',
        price: '',
        description: '',
        category: 'Computers',
        subCategory: 'Laptops',
        type: 'new',
        image: []
      });
      setFiles([]);

      // Send notifications to followers about the new listing
      await sendNewListingNotification(productRef.id, newProduct.name);
    } catch (err) {
      console.error("Error uploading product:", err);
      setError(err.message);
    }
    setUploading(false);
  };

  // Fetch seller's active listings
  useEffect(() => {
    const sellerId = auth.currentUser ? auth.currentUser.uid : null;
    if (sellerId) {
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", sellerId),
        where("expiryDate", ">", new Date())
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMyProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Product</h2>
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Computers">Computers</option>
            <option value="Accessories">Accessories</option>
            <option value="Mobile Devices">Mobile Devices</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SubCategory</label>
          <select
            value={product.subCategory}
            onChange={(e) => setProduct({ ...product, subCategory: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Laptops">Laptops</option>
            <option value="Desktops">Desktops</option>
            <option value="Mouse">Mouse</option>
            <option value="Keyboards">Keyboards</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="new"
                checked={product.type === 'new'}
                onChange={() => setProduct({ ...product, type: 'new' })}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="ml-2">New</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="refurbished"
                checked={product.type === 'refurbished'}
                onChange={() => setProduct({ ...product, type: 'refurbished' })}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
              <span className="ml-2">Refurbished</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleFilesChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept="image/*"
            required
          />
          <div className="mt-2 text-sm text-gray-500">
            {files.length > 0 && `${files.length} file(s) selected`}
          </div>
        </div>
        {uploading && <div className="text-sm text-blue-600">Uploading images...</div>}
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        <button
          type="submit"
          disabled={uploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {uploading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">My Listings</h2>
        {myProducts.length === 0 ? (
          <p>No active listings.</p>
        ) : (
          myProducts.map(product => (
            <div key={product.id} className="border p-4 my-4 rounded">
              <ProductItem
                id={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
              <BumpListing productId={product.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
