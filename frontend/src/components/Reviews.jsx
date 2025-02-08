// /src/components/Reviews.jsx
import React, { useState, useEffect } from 'react'; //import react and other necessary components.
import { collection, query, where, orderBy, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]); //Different states to hold different datas as well as handling authentication.
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const auth = getAuth();

  // Fetch reviews for the current product
  useEffect(() => {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
    });
    return () => unsubscribe();
  }, [productId]);

  // Compute the average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault(); //This is used to prevent default form submission.
    setError("");
    if (!auth.currentUser) {
      setError("You must be logged in to leave a review.");
      return;
    }
    try {
      await addDoc(collection(db, "reviews"), {
        productId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || auth.currentUser.email,
        rating,
        review: newReview,
        createdAt: serverTimestamp(),
      });
      setNewReview("");
      setRating(5);
      setSuccess("Review submitted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error submitting review. Please try again.");
    }
  };

  return ( //Main container for rendering the review ui.
    <div className="reviews-section my-6">
      <h3 className="text-xl font-bold mb-2">Reviews</h3>
      <div className="average-rating mb-4">
        <span className="font-medium">Average Rating: {averageRating} / 5</span>
        <span className="ml-2">({reviews.length} reviews)</span>
      </div>
      <ul>
        {reviews.map(review => (
          <li key={review.id} className="border-b py-2">
            <div className="flex items-center">
              <span className="font-semibold">{review.userName}</span>
              <span className="ml-2 text-yellow-500">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </span>
            </div>
            <p className="mt-1 text-gray-700">{review.review}</p>
          </li>
        ))}
      </ul>
      <div className="review-form mt-6">
        <h4 className="font-bold mb-2">Leave a Review</h4>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border rounded p-1"
            >
              {[5, 4, 3, 2, 1].map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block">Review:</label>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full border rounded p-2"
              rows="3"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
