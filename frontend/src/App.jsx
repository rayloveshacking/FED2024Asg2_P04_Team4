import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Shop from './pages/Shop';
import New from './pages/New';
import Refurbished from './pages/Refurbished';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import SellerDashboard from './pages/SellerDashBoard';
import SellerProfile from './pages/SellerProfile';
import FollowingListings from './pages/FollowingListings';
import SavedListings from './pages/SavedListings';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/new' element={<New />} />
        <Route path='/refurbished' element={<Refurbished />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/refurbished/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/seller-dashboard' element={<SellerDashboard />} />
        <Route path='/seller/:sellerId' element={<SellerProfile />} />
        <Route path='/following-listings' element={<FollowingListings />} />
        <Route path='/saved-listings' element={<SavedListings />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
