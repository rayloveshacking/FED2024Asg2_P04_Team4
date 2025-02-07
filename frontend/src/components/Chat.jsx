import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Chat = ({ sellerId }) => {
  const auth = getAuth(); //This initializes firebase auth.
  const [currentUser, setCurrentUser] = useState(null); //This is the state to store the current authenticated user.
  const [authChecked, setAuthChecked] = useState(false); //This is a flag to indicate that the authentication state has been checked.
  const [conversationId, setConversationId] = useState(null); //This is the state to store the unique conversation ID for this chat.
  const [messages, setMessages] = useState([]); //This is the state to hold an array of messages in the current conversation.
  const [newMessage, setNewMessage] = useState(''); //This is the state to hold the new message input by the user.

  // Subscribe to auth state changes so we know when a user is loaded
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  // Compute a unique conversation ID and ensure the conversation document includes participants
  useEffect(() => {
    if (currentUser && sellerId) {
      const ids = [currentUser.uid, sellerId].sort();
      const convId = ids.join('_');
      setConversationId(convId);
      const convDocRef = doc(db, 'chats', convId);
      // Always include the participants field along with a local timestamp
      setDoc(convDocRef, {
        participants: [currentUser.uid, sellerId],
        lastUpdated: new Date()
      }, { merge: true });
    }
  }, [currentUser, sellerId]);

  // Listen for messages in the conversation in real time
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

  // Handler for sending a new message; update the conversation doc with participants too
  const handleSend = async () => {
    if (newMessage.trim() === '') return;
    if (!currentUser) return;
    const messagesRef = collection(db, 'chats', conversationId, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      recipientId: sellerId,
      text: newMessage,
      timestamp: new Date()
    });
    const convDocRef = doc(db, 'chats', conversationId);
    await setDoc(convDocRef, {
      participants: [currentUser.uid, sellerId],
      lastMessage: newMessage,
      lastUpdated: new Date()
    }, { merge: true });
    setNewMessage('');
  };

  if (!authChecked) { //If auth state hasnt been checked, show a loading indicator.
    return <div>Loading...</div>;
  }
  if (!currentUser) {
    return <div>Please log in to chat.</div>; //If no user is logged in, prompt user to log in.
  }

  return (
    <div className="chat-window border p-4 max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-2">Chat with Seller</h3>
      <div className="messages h-64 overflow-y-auto border p-2 mb-2">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-1 ${msg.senderId === currentUser.uid ? 'text-right' : 'text-left'}`}>
            <p className="inline-block p-2 rounded bg-gray-200">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input 
          type="text" 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded ml-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
