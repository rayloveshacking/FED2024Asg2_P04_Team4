// /src/pages/Cart.jsx
import React, { useContext, useState } from "react"; //import react and other necessary components.
import { ShopContext } from "../context/ShopContext";
import CheckoutModal from "../components/CheckoutModal";
import PointsCheckoutModal from "../components/PointsCheckOutModal";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, currency, clearCart } = useContext(ShopContext); //Destructure the cart and related functions from the shop context.
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPointsCheckout, setShowPointsCheckout] = useState(false);

  const totalPrice = cart.reduce( //This is to calculate the total price by summing up the cost of each item.
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return ( //Main container for rendering the cart 
    <div className="max-w-4xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Image</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">
                    <img
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">
                    {currency} {item.price}
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartQuantity(item.id, parseInt(e.target.value))
                      }
                      className="w-16 p-1 border"
                    />
                  </td>
                  <td className="border p-2">
                    {currency} {item.price * item.quantity}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <p className="text-xl font-bold">
              Total: {currency} {totalPrice}
            </p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setShowCheckout(true)}
                className="bg-green-600 text-white py-2 px-4 rounded"
              >
                Checkout with Card
              </button>
              <button
                onClick={() => setShowPointsCheckout(true)}
                className="bg-purple-600 text-white py-2 px-4 rounded"
              >
                Checkout with Coins
              </button>
            </div>
          </div>
        </div>
      )}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          totalPrice={totalPrice}
          onClose={() => setShowCheckout(false)}
          clearCart={clearCart}
        />
      )}
      {showPointsCheckout && (
        <PointsCheckoutModal
          cart={cart}
          totalPrice={totalPrice}
          onClose={() => setShowPointsCheckout(false)}
          clearCart={clearCart}
        />
      )}
    </div>
  );
};

export default Cart;
