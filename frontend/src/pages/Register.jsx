import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import app from '../firebase';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../firebase';
import Lottie from 'lottie-react';
import successAnimation from '../assets/animations/success.json';

const Register = () => {
  const [name, setName] = useState(''); // New field for user's name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [role, setRole] = useState('customer');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the Auth profile with the display name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Save additional user data (including name) to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role,
        createdAt: serverTimestamp()
      });
      // Show success animation before navigating
      setShowAnimation(true);
      setTimeout(() => {
        navigate(role === 'seller' ? '/seller-dashboard' : '/');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  if (showAnimation) {
    return (
      <div className="max-w-md mx-auto my-8 p-4 flex flex-col items-center">
        <Lottie animationData={successAnimation} style={{ height: 200, width: 200 }} />
        <h2 className="text-2xl font-bold mt-4">Account Created Successfully!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister}>
        {/* Name Input Field */}
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* Email */}
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* Account Type */}
        <div className="mb-4">
          <label className="block mb-2">Account Type</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
