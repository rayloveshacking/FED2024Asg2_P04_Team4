import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const Chats = () => {
  const auth = getAuth(); //Initialize firebase authentication.
  const [currentUser, setCurrentUser] = useState(null); //Different states to store different datas.
  const [authChecked, setAuthChecked] = useState(false);
  const [chats, setChats] = useState([]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  // Listen for chats that include the current user and order them by lastUpdated
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

  if (!authChecked) {
    return <div>Loading...</div>;
  }
  if (!currentUser) {
    return <div>Please log in to view your chats.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Conversations</h2>
      {chats.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul>
          {chats.map(chat => {
            // Assumes a one-to-one conversation; find the other participant’s ID
            const otherParticipant = chat.participants.find(p => p !== currentUser.uid);
            return (
              <li key={chat.id} className="border p-4 mb-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold">Chat with: {otherParticipant}</p>
                  <p className="text-sm text-gray-600">{chat.lastMessage || "No messages yet."}</p>
                </div>
                <Link to={`/chats/${chat.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Open Chat
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Chats;
