// /src/pages/ChatDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import Firestore functions to work with collections, documents, queries, and timestamps
import { collection, doc, query, orderBy, addDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
//import the Firestore database instance
import { db } from '../firebase';
//import Firebase authentication functions
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//import Lottie for animations and the login animation JSON file
import Lottie from 'lottie-react';
import loginAnimation from '../assets/animations/loginAnimation.json';

const ChatDetail = () => {
  //This extract the conversationId from URL parameters
  const { conversationId } = useParams();
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  //This is to listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  //This is to set up a real-time listener for messages in the conversation
  useEffect(() => {
    if (conversationId) {
      const messagesRef = collection(db, 'chats', conversationId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      });
      return () => unsubscribe();
    }
  }, [conversationId]);

  //This is the function to handle sending a new message
  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    if (!currentUser) return;
    //This is to add a new message to the messages subcollection
    const messagesRef = collection(db, 'chats', conversationId, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: new Date()
    });
    //Update the conversation document with the last message and timestamp
    const chatDocRef = doc(db, 'chats', conversationId);
    await setDoc(chatDocRef, {
      participants: conversationId.split('_'),
      lastMessage: newMessage,
      lastUpdated: new Date()
    }, { merge: true });
    //Determine the recipient (the UID that is not the current user's)
    const recipientId = conversationId.split('_').find(id => id !== currentUser.uid);
    //To Create a notification for the recipient about the new message
    await addDoc(collection(db, "notifications"), {
      userId: recipientId,
      type: "message",
      message: `New message from ${currentUser.displayName || currentUser.email}: ${newMessage}`,
      link: `/chats/${conversationId}`,
      read: false,
      createdAt: serverTimestamp()
    });
    //Clear the new message input field
    setNewMessage("");
  };

  //If authentication has not been checked yet, display a loading message
  if (!authChecked) {
    return <div>Loading...</div>;
  }
  //If no user is authenticated, display a centered fallback UI with reduced spacing
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Lottie animationData={loginAnimation} style={{ height: 200, width: 200 }} loop={true} />
        <p className="mt-4 text-xl font-bold text-center">Please log in to view your chats.</p>
      </div>
    );
  }

  //Render the chat interface if the user is authenticated
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      {/* Display messages in a scrollable container */}
      <div className="border p-4 h-80 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-2 ${msg.senderId === currentUser.uid ? 'text-right' : 'text-left'}`}>
            <p className="inline-block p-2 rounded bg-gray-200">{msg.text}</p>
          </div>
        ))}
      </div>
      {/* Input area for composing a new message */}
      <div className="flex mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded p-2"
        />
        <button onClick={handleSend} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
