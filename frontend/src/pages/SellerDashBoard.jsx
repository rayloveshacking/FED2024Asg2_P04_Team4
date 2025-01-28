import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from "firebase/auth";
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
        images: []
    });
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        try {
            if (!files.length) {
                throw new Error('Please upload at least one image');
            }

            // Upload images
            const imageUrls = await Promise.all(
                files.map(async (file) => {
                    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setProgress(progress);
                        },
                        (error) => {
                            throw error;
                        }
                    );
                    
                    await uploadTask;
                    return await getDownloadURL(uploadTask.snapshot.ref);
                })
            );

            // Save product data
            await addDoc(collection(db, 'products'), {
                ...product,
                price: Number(product.price),
                images: imageUrls,
                createdAt: serverTimestamp(),
                sellerId: auth.currentUser.uid,
                bestseller: false // Add default bestseller status
            });
            
            setSuccess('Product uploaded successfully!');
            // Reset form
            setProduct({
                name: '',
                price: '',
                description: '',
                category: 'Computers',
                subCategory: 'Laptops',
                type: 'new',
                images: []
            });
            setFiles([]);
            setProgress(0);

        } catch (error) {
            console.error('Error uploading product:', error);
            setError(error.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-8 p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Upload Product</h2>
            <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({...product, name: e.target.value})}
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
                            onChange={(e) => setProduct({...product, price: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={product.description}
                            onChange={(e) => setProduct({...product, description: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-32"
                            required
                        />
                    </div>

                    {/* Category and Subcategory */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={product.category}
                                onChange={(e) => setProduct({...product, category: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="Computers">Computers</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Mobile Devices">Mobile Devices</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                            <select
                                value={product.subCategory}
                                onChange={(e) => setProduct({...product, subCategory: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="Laptops">Laptops</option>
                                <option value="Desktops">Desktops</option>
                                <option value="Mouse">Mouse</option>
                                <option value="Keyboards">Keyboards</option>
                                <option value="Phone">Phone</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Type</label>
                        <div className="mt-1 flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="new"
                                    checked={product.type === 'new'}
                                    onChange={() => setProduct({...product, type: 'new'})}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span className="ml-2">New</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="refurbished"
                                    checked={product.type === 'refurbished'}
                                    onChange={() => setProduct({...product, type: 'refurbished'})}
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
                            onChange={(e) => setFiles([...e.target.files])}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            accept="image/*"
                            required
                        />
                        <div className="mt-2 text-sm text-gray-500">
                            {files.length > 0 && `${files.length} file(s) selected`}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                {progress > 0 && (
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div className="text-xs text-blue-700">
                                Uploading... {Math.round(progress)}%
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-50">
                            <div
                                style={{ width: `${progress}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                            ></div>
                        </div>
                    </div>
                )}

                {/* Status Messages */}
                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                {success && <div className="text-green-600 text-sm mt-2">{success}</div>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={progress > 0 && progress < 100}
                >
                    Upload Product
                </button>
            </form>
        </div>
    );
};

export default SellerDashboard;