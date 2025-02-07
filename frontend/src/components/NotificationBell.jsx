// /src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { assets } from '../assets/assets';

const NotificationBell = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(notifs);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (notifId) => {
    try {
      const notifRef = doc(db, "notifications", notifId);
      await updateDoc(notifRef, { read: true, updatedAt: serverTimestamp() });
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative focus:outline-none"
      >
        <img
          src={assets.bell_icon} // Uses your locally stored bell icon
          alt="Notifications"
          className="w-6 h-6 transform rotate-0 mt-2"  // Added mt-2 to move it downward
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded z-50">
          <div className="p-4 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-2 border-b border-gray-100 ${notif.read ? "bg-gray-50" : "bg-white"}`}
                >
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-400">
                    {notif.createdAt && notif.createdAt.toDate().toLocaleString()}
                  </p>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs text-blue-600 mt-1 cursor-pointer"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
