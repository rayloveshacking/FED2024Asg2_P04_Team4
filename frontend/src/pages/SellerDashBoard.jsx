import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
    image: [] // This will hold the Cloudinary image URLs
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  // Function to upload a single image file to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'unsigned_preset'); // Replace with your unsigned upload preset
    data.append('cloud_name', 'dls2ndk2q'); // Replace with your Cloudinary cloud name

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dls2ndk2q/image/upload`,
        data
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw err;
    }
  };

  // Handle file selection
  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // Handle product upload: upload images then save full product details to Firestore
  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      if (!files.length) {
        throw new Error('Please upload at least one image');
      }

      // Upload all selected files to Cloudinary and collect their URLs
      const uploadedUrls = await Promise.all(
        files.map(file => uploadImageToCloudinary(file))
      );

      // Build the new product object
      const newProduct = {
        ...product,
        image: uploadedUrls,
        price: Number(product.price),
        createdAt: serverTimestamp(),
        sellerId: auth.currentUser.uid,
        bestseller: false // Default value
      };

      // Save product data to Firestore
      await addDoc(collection(db, 'products'), newProduct);

      setSuccess('Product uploaded successfully!');
      // Reset form state
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
    } catch (error) {
      console.error('Error uploading product:', error);
      setError(error.message);
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
