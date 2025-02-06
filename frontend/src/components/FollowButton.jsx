// /src/components/FollowButton.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; //This will import the firebase auth to get the current user.
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'; //This will get the firestore methods for reading/updating documents.
import { db } from '../firebase'; //This will import the firebase database instance.

const FollowButton = ({ sellerId }) => {
  const auth = getAuth(); //This will get the currently authenticated user.
  const currentUser = auth.currentUser;
  const [isFollowing, setIsFollowing] = useState(false); //This is the state to determine if the current user is following the given seller.
  const [loading, setLoading] = useState(true); //This is the state to track if the follow status is still being fetched.

  useEffect(() => { //This is the useeffect hook to fetch the follow data when the component mounts or when currentuser/sellerid changes.
    if (currentUser) {
      const fetchFollowing = async () => { //This is to define an async function to fetch the user's following list.
        try {
          const userDocRef = doc(db, 'users', currentUser.uid); //This is to get a reference to the user's document in firestore.
          const docSnap = await getDoc(userDocRef); //This is to retreive the document snapshot.
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsFollowing(data.following && data.following.includes(sellerId)); //This is to check if the following array exists and include the sellerId.
          }
        } catch (error) {
          console.error("Error fetching follow data: ", error);
        } finally {
          setLoading(false); //This is to set the loading to false after fetching is complete, regardless of success or error.
        }
      };
      fetchFollowing();
    }
  }, [currentUser, sellerId]);

  const handleFollowToggle = async () => { //This is the function to toggle the follow status when the button is clicked.
    if (!currentUser) return; //If there is no authenticated user, do nothing.
    const userDocRef = doc(db, 'users', currentUser.uid); //This is to reference the current user's document in the firestore.
    try {
      if (isFollowing) {
        await updateDoc(userDocRef, { //If the user is already following, remove the sellerId from the following array.
          following: arrayRemove(sellerId)
        });
      } else {
        await updateDoc(userDocRef, { //If the user is not following, add the sellerId to the following array.
          following: arrayUnion(sellerId)
        });
      }
      setIsFollowing(!isFollowing); //This is to toggle the local follow state.
    } catch (error) {
      console.error("Error updating follow status: ", error);
    }
  };

  if (loading) { //If the follow data is still being fetched, this will show a loading button.
    return <button className="bg-gray-300 text-white px-4 py-2 rounded">Loading...</button>;
  }

  return ( //This is to render the follow/unfollow button. The button text dynamically changes based on the current follow status.
    <button
      onClick={handleFollowToggle}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
