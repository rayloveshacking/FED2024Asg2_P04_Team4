// /src/components/Footer.jsx
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';

const Footer = () => {
  const { awardAchievement } = useContext(ShopContext);

  // Function to trigger the hidden achievement (e.g. "Hidden Treasure")
  const handleSecretClick = () => {
    awardAchievement("Hidden Treasure");
  };

  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            MokeSell is a premium online store for your shopping needs. We offer a wide range of products from electronics, gadgets, accessories and more.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+65-4225-7890</li>
            <li>contact@mokesell.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2025@mokesell.com - All Right Reserved</p>
      </div>
      {/* Hidden easter egg link for unlocking the "Hidden Treasure" achievement */}
      <div className="text-center mt-2">
        <span
          onClick={handleSecretClick}
          className="text-xs text-gray-500 cursor-pointer hover:underline"
          title="Find the hidden reward"
        >
          Secret Reward?
        </span>
      </div>
    </div>
  );
};

export default Footer;
