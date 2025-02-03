import React, { useState, useEffect } from 'react';
import { getAuth, updateEmail, updatePassword, updateProfile, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import app from '../firebase';

const Profile = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load current user data when the component mounts
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      // Prompt user for their current password to reauthenticate
      const currentPassword = prompt("Please enter your current password to continue");
      if (!currentPassword) {
        throw new Error("Current password is required for reauthentication.");
      }
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email if changed
      if (user.email !== email) {
        await updateEmail(user, email);
      }
      // Update password if provided
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
      // Update display name if changed
      if (user.displayName !== name) {
        await updateProfile(user, { displayName: name });
        // Also update the user's Firestore document
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { name });
      }
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">New Password (leave blank to keep current)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
