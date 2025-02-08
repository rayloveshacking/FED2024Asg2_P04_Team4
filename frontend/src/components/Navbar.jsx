// /src/components/Navbar.jsx
import React, { useContext, useState, useEffect, useRef } from 'react'; //import react and all other necessary components.
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import app from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import NotificationBell from './NotificationBell'; // New import for notifications

const Navbar = () => { 
  const [visible, setVisible] = useState(false); //Different states to store different datas and controls.
  const { setShowSearch } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const auth = getAuth(app); //Initialize firebase auth with the app config.

  useEffect(() => { //This is used to listen for changes in the authentication state.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe(); //This clean up subscription on component unmount.
  }, [auth]);

  useEffect(() => { //This is to fetch the user's role from firestore when a user is authenticated.
    if (user) {
      const fetchUserRole = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
      };
      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [user]);

  const handleLogout = async () => { //This is the function to handle user logout.
    try {
      await signOut(auth);
      setProfileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => { //This is used to close the profile dropdown if a click is detected outside.
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileRef]);

  return ( //The main container for navbar, styled to space items fairly.
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to={'/'}>
        <img src={assets.logo} className='w-36' alt="Logo" />
      </Link>
      <ul className='hidden sm:flex gap-12 text-sm text-gray-700 font-sans'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p className="font-bold">SHOP</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/new' className='flex flex-col items-center gap-1'>
          <p className="font-bold">NEW</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/refurbished' className='flex flex-col items-center gap-1'>
          <p className="font-bold">REFURBISHED</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/following-listings' className='flex flex-col items-center gap-1'>
          <p className="font-bold">FOLLOWING</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p className="font-bold">CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/saved-listings' className='flex flex-col items-center gap-1'>
          <p className="font-bold">SAVED</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className='w-5 cursor-pointer'
          alt="Search"
        />
        {/* Notification Bell */}
        <NotificationBell />
        {/* Profile Icon with dropdown */}
        <div ref={profileRef} className='relative'>
          <img
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className='w-5 cursor-pointer'
            src={assets.profile_icon}
            alt="Profile"
          />
          {profileMenuOpen && (
            <div className='absolute right-0 top-full mt-2 z-10'>
              <div className='flex flex-col gap-2 w-36 px-5 py-3 bg-slate-100 text-gray-500 rounded shadow'>
                {user ? (
                  <>
                    <Link onClick={() => setProfileMenuOpen(false)} to="/profile" className="cursor-pointer hover:text-black">
                      My Profile
                    </Link>
                    <Link onClick={() => setProfileMenuOpen(false)} to="/orders" className="cursor-pointer hover:text-black">
                      Orders
                    </Link>
                    {userRole === 'seller' && (
                      <Link onClick={() => setProfileMenuOpen(false)} to="/seller-dashboard" className="cursor-pointer hover:text-black">
                        Seller Dashboard
                      </Link>
                    )}
                    <Link onClick={() => setProfileMenuOpen(false)} to="/chats" className="cursor-pointer hover:text-black">
                      Chats
                    </Link>
                    <p className="cursor-pointer hover:text-black" onClick={handleLogout}>
                      Logout
                    </p>
                  </>
                ) : (
                  <Link onClick={() => setProfileMenuOpen(false)} to="/login" className="cursor-pointer hover:text-black">
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            10
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className="flex flex-col text-gray-600">
          <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Back" />
            <p className="font-bold">Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className="py-2 -pl-6 border font-bold" to="/">
            SHOP
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 -pl-6 border font-bold" to="/new">
            NEW
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 -pl-6 border font-bold" to="/refurbished">
            REFURBISHED
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 -pl-6 border font-bold" to="/following-listings">
            FOLLOWING
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 -pl-6 border font-bold" to="/contact">
            CONTACT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 -pl-6 border font-bold" to="/saved-listings">
            SAVED
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
