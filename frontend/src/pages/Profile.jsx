// /src/pages/Profile.jsx
import React, { useState, useEffect } from 'react'; //Import react, firebase and other necessary components.
import {
  getAuth,
  updateEmail,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; //import firestore database configuration.
import app from '../firebase';
import Rewards from '../components/Rewards';

const Profile = () => {
  const auth = getAuth(app);
  const user = auth.currentUser; //Get the current user

  const [name, setName] = useState(''); //Different states to hold and store different datas
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState('customer'); 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  //Load current user data including the role from Firestore
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      const fetchRole = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid); //get reference to user document in firestore.
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role || 'customer'); //Update the role with doc or use default customer role.
          }
        } catch (err) {
          console.error("Error fetching role:", err);
        }
      };
      fetchRole();
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault(); //Prevent default submission
    setError('');
    setMessage('');

    try {
      //Ask for current password to reauthenticate
      const currentPassword = prompt("Please enter your current password to continue");
      if (!currentPassword) {
        throw new Error("Current password is required for reauthentication.");
      }
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      //Update email if it has changed
      if (user.email !== email) {
        await updateEmail(user, email);
      }
      //Update password if a new one was provided
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
      //Update display name if it has changed
      if (user.displayName !== name) {
        await updateProfile(user, { displayName: name });
      }
      //Update Firestore user document with new name and role
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name, role });
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
        {/* Account Type Field */}
        <div>
          <label className="block mb-1">Account Type</label>
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
      <Rewards />
    </div>
  );
};

export default Profile;
