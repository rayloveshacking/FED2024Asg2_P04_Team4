// /src/components/FollowButton.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

const FollowButton = ({ sellerId }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchFollowing = async () => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsFollowing(data.following && data.following.includes(sellerId));
          }
        } catch (error) {
          console.error("Error fetching follow data: ", error);
        } finally {
          setLoading(false);
        }
      };
      fetchFollowing();
    }
  }, [currentUser, sellerId]);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      if (isFollowing) {
        await updateDoc(userDocRef, {
          following: arrayRemove(sellerId)
        });
      } else {
        await updateDoc(userDocRef, {
          following: arrayUnion(sellerId)
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating follow status: ", error);
    }
  };

  if (loading) {
    return <button className="bg-gray-300 text-white px-4 py-2 rounded">Loading...</button>;
  }

  return (
    <button
      onClick={handleFollowToggle}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
