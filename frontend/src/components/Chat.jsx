// /src/components/Chat.jsx
import React, { useState, useEffect } from 'react';
import { collection, doc, setDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Chat = ({ sellerId }) => {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (currentUser && sellerId) {
      const ids = [currentUser.uid, sellerId].sort();
      const convId = ids.join('_');
      setConversationId(convId);
      const convDocRef = doc(db, 'chats', convId);
      setDoc(convDocRef, {
        participants: [currentUser.uid, sellerId],
        lastUpdated: new Date()
      }, { merge: true });
    }
  }, [currentUser, sellerId]);

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

  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    if (!currentUser) return;
    const messagesRef = collection(db, 'chats', conversationId, 'messages');
    // Add the message
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      recipientId: sellerId,
      text: newMessage,
      timestamp: new Date()
    });
    // Update the conversation document
    const convDocRef = doc(db, 'chats', conversationId);
    await setDoc(convDocRef, {
      participants: [currentUser.uid, sellerId],
      lastMessage: newMessage,
      lastUpdated: new Date()
    }, { merge: true });
    // Send a notification to the recipient if they are not the sender
    if (sellerId !== currentUser.uid) {
      await addDoc(collection(db, "notifications"), {
        userId: sellerId,
        type: "message",
        message: `New message from ${currentUser.displayName || currentUser.email}: ${newMessage}`,
        link: `/chats/${conversationId}`,
        read: false,
        createdAt: serverTimestamp()
      });
    }
    setNewMessage('');
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }
  if (!currentUser) {
    return <div>Please log in to chat.</div>;
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
        <button onClick={handleSend} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
