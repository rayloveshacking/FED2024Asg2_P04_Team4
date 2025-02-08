// /src/pages/Chats.jsx
import React, { useState, useEffect } from 'react'; //import react and firebase necessary components.
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
//import lottie for animations
import Lottie from 'lottie-react';
import loginAnimation from '../assets/animations/loginAnimation.json';

//To render each chat item with the other participant's name
const ChatItem = ({ chat, currentUser }) => {
  //Determine the other participant's UID by filtering out the current user's UID
  const otherParticipant = chat.participants.find(p => p !== currentUser.uid);
  const [otherName, setOtherName] = useState(otherParticipant);

  useEffect(() => {
    //Fetch the other participant's name from Firestore
    const fetchUserName = async () => {
      const userDocRef = doc(db, 'users', otherParticipant);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        //Prefer the 'name' field; if not available, use displayName or fallback to the UID
        setOtherName(userData.name || userData.displayName || otherParticipant);
      }
    };
    fetchUserName();
  }, [otherParticipant]);

  return (
    <li className="border p-4 mb-2 flex justify-between items-center">
      <div>
        <p className="font-semibold">Chat with: {otherName}</p>
        <p className="text-sm text-gray-600">{chat.lastMessage || "No messages yet."}</p>
      </div>
      <Link to={`/chats/${chat.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">
        Open Chat
      </Link>
    </li>
  );
};

const Chats = () => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [chats, setChats] = useState([]);

  //Listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  //Listen for chats involving the current user and order by lastUpdated descending
  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, "chats"),
        where("participants", "array-contains", currentUser.uid),
        orderBy("lastUpdated", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatList);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  //If authentication check is not complete, display a loading message
  if (!authChecked) {
    return <div>Loading...</div>;
  }
  //If there is no authenticated user, show a centered fallback with a Lottie animation and login prompt.
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Lottie animationData={loginAnimation} style={{ height: 200, width: 200 }} loop={true} />
        <p className="mt-4 text-xl font-bold text-center">Please log in to view your chats.</p>
      </div>
    );
  }

  //Render the chat list if the user is authenticated
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Conversations</h2>
      {chats.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {chats.map(chat => (
            <ChatItem key={chat.id} chat={chat} currentUser={currentUser} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Chats;
