import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebase';

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

  // Check active listings count
  const checkActiveListingsLimit = async () => {
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', auth.currentUser.uid),
      where('active', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      // Enforce active listings limit of 30
      const activeCount = await checkActiveListingsLimit();
      if (activeCount >= 30) {
        throw new Error("You have reached the maximum of 30 active listings.");
      }

      if (!files.length) {
        throw new Error("Please upload at least one image.");
      }

      const uploadedUrls = await Promise.all(files.map(file => uploadImageToCloudinary(file)));

      const newProduct = {
        ...product,
        image: uploadedUrls,
        price: Number(product.price),
        sellerId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName || '',
        active: true,       // Mark listing as active
        bump: 0,            // Default bump value
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'products'), newProduct);

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
    } catch (err) {
      console.error("Error uploading product:", err);
      setError(err.message);
    }
    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload Product</h2>
      <form onSubmit={handleUpload} className="space-y-6">
        {/* Product Name */}
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
        {/* Price */}
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
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
            required
          />
        </div>
        {/* Category */}
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
        {/* SubCategory */}
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
        {/* Product Type */}
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
        {/* File Upload */}
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

        {/* Status Messages */}
        {uploading && <div className="text-sm text-blue-600">Uploading images...</div>}
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {uploading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
    </div>
  );
};

export default SellerDashboard;
