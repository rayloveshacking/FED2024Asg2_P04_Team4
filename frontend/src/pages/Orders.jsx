// /src/pages/Orders.jsx
import React, { useState, useEffect } from 'react'; // Import react and other necessary components.
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Orders = () => {
  const [orders, setOrders] = useState([]); //This is a local state to store the list of orders retrieved from firestore.
  const auth = getAuth(); //This gets the firebase authentication instance.

  useEffect(() => { //This useEffect fetch orders for the current user and runs when the current user authentication state changes.
    if (auth.currentUser) { //This make it to only run when there is a logged in user.
      const q = query( //Fire store query that query the orders collection and filter to only include orders where the userId matches the current user's uid.
        collection(db, "orders"),
        where("userId", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => { // This will listen for real time updates to the query and the onSnapshot returns a function that cleans up the listener.
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); // This map over the snapshot documents to build an array of order objects.
      });
      return () => unsubscribe(); // Return the unsubscribe function to clean up the listener when the component unmounts or when the dependency changes.
    }
  }, [auth.currentUser]); // This effect depends on auth.currentUser

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded">
              <p className="font-medium">Order ID: {order.id}</p>
              <p>Total: ${order.total}</p>
              <p>
                Date:{" "}
                {order.createdAt ? order.createdAt.toDate().toLocaleString() : "N/A"}
              </p>
              <div>
                <p className="font-medium">Items:</p>
                <ul className="list-disc ml-5">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} x {item.quantity} - ${item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
