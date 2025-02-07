import React, { useState, useEffect } from 'react'; //import react and other necessary components.
import { useParams } from 'react-router-dom';
import { collection, doc, query, orderBy, addDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ChatDetail = () => {
  const { conversationId } = useParams(); //This extracts the conversation id from url params.
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null); //Different states to store different datas.
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Subscribe to auth state changes to determine the current user
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribeAuth();
  }, [auth]);

  // Listen for messages in the conversation (ordered by timestamp)
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

  // When sending a message, update the conversation document to include participants
  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    if (!currentUser) return;
    const messagesRef = collection(db, 'chats', conversationId, 'messages');
    await addDoc(messagesRef, {
      senderId: currentUser.uid,
      text: newMessage,
      timestamp: new Date()
    });
    const chatDocRef = doc(db, 'chats', conversationId);
    // Ensure the conversation document has the participants field (derived from conversationId)
    await setDoc(chatDocRef, {
      participants: conversationId.split('_'),
      lastMessage: newMessage,
      lastUpdated: new Date()
    }, { merge: true });
    setNewMessage("");
  };

  if (!authChecked) { //If authentication state is not checked yet, display loading message.
    return <div>Loading...</div>;
  }
  if (!currentUser) { //If no user is logged in, prompt the user to log in to view the chat.
    return <div>Please log in to view your chats.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <div className="border p-4 h-80 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`mb-2 ${msg.senderId === currentUser.uid ? 'text-right' : 'text-left'}`}>
            <p className="inline-block p-2 rounded bg-gray-200">{msg.text}</p>
          </div>
        ))}
      </div>
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
