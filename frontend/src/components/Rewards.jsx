// /src/components/Rewards.jsx
import React, { useContext } from 'react'; //import react and other necessary components.
import { ShopContext } from '../context/ShopContext';
import Lottie from 'lottie-react';
import rewardAnimation from '../assets/animations/3dReward.json'; 

const Rewards = () => {
  const { rewards } = useContext(ShopContext);
  const { points, achievements } = rewards;

  // Determine loyalty tier based on points
  const loyaltyTier =
    points >= 100000
      ? 'Platinum'
      : points >= 50000
      ? 'Gold'
      : points >= 10000
      ? 'Silver'
      : 'Bronze';

  // Filter out duplicate achievements
  const uniqueAchievements = [...new Set(achievements)];

  return ( //Main container for rendering the user rewards and achievements.
    <div className="p-4 border rounded shadow my-4">
      <h2 className="text-xl font-bold mb-2">Your Rewards</h2>
      <p>Total Points: {points}</p>
      <p>Loyalty Tier: {loyaltyTier}</p>
      <h3 className="text-lg font-semibold mt-4">Achievements:</h3>
      {uniqueAchievements.length === 0 ? (
        <p>No achievements yet. Keep shopping to unlock rewards!</p>
      ) : (
        <ul className="list-disc ml-6">
          {uniqueAchievements.map((ach, index) => (
            <li key={index}>{ach}</li>
          ))}
        </ul>
      )}
      {uniqueAchievements.includes('Hidden Treasure') && (
        <div className="mt-4">
          <p className="font-bold">3D Reward Unlocked!</p>
          <Lottie animationData={rewardAnimation} loop={true} style={{ height: 200, width: 200 }} />
        </div>
      )}
    </div>
  );
};

export default Rewards;
