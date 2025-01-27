// Create SellerDashboard.jsx
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

    const handleUpload = async (e) => {
        e.preventDefault();
        
        try {
            // Upload images
            const imageUrls = await Promise.all(
                files.map(async (file) => {
                    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    
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
                sellerId: auth.currentUser.uid
            });
            
            alert('Product uploaded successfully!');
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
        } catch (error) {
            console.error('Error uploading product:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto my-8 p-4">
            <h2 className="text-2xl font-bold mb-4">Upload Product</h2>
            <form onSubmit={handleUpload}>
                {/* Product fields */}
                <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default SellerDashboard;