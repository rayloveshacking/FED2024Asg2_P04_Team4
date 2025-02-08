// /src/components/Chat.jsx
import React, { useState, useEffect } from 'react'; //import react, firebase and other necessary components.
import { collection, doc, setDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Chat = ({ sellerId }) => {
  const auth = getAuth(); //initialize firebase authentication instance
  const [currentUser, setCurrentUser] = useState(null); //Different states to store nad hold different datas.
  const [authChecked, setAuthChecked] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => { //This useEffect listen for changes in authentication status
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => { //This subscribe to authentication state changes.
      setCurrentUser(user); //update current user when the state changes.
      setAuthChecked(true); //Mark that authentication has been checked.
    });
    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => { //This will create or update the conversation document in firestore when currentUser or sellerId changes.
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

  useEffect(() => { //This set up a real time listener for messages in the current conversation.
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

  const handleSend = async () => { //This is the function to handle sending a new message.
    if (newMessage.trim() === "") return;
    if (!currentUser) return;
    const messagesRef = collection(db, 'chats', conversationId, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: new Date()
    });
    const convDocRef = doc(db, 'chats', conversationId); //This update the conversation document with the latest message and updated timestamp.
    await setDoc(convDocRef, {
      participants: [currentUser.uid, sellerId],
      lastMessage: newMessage,
      lastUpdated: new Date()
    }, { merge: true });
    // Determine the recipient as the other participant in the conversation.
    const recipientId = conversationId.split('_').find(id => id !== currentUser.uid);
    await addDoc(collection(db, "notifications"), {
      userId: recipientId,
      type: "message",
      message: `New message from ${currentUser.displayName || currentUser.email}: ${newMessage}`,
      link: `/chats/${conversationId}`,
      read: false,
      createdAt: serverTimestamp()
    });
    setNewMessage('');
  };

  if (!authChecked) { //This displays a loading message until authentication has been checked.
    return <div>Loading...</div>;
  }
  if (!currentUser) { //This prompt the user to login if there is no authenticated user.
    return <div>Please log in to chat.</div>;
  }

  return ( //Main container for rendering the chat interface.
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
