// /src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [auth.currentUser]);

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
