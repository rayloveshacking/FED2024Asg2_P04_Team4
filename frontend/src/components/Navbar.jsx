import React, { useContext, useState, useEffect, useRef } from 'react'; //import react and all necessary components.
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import { assets } from '../assets/assets';
import { NavLink, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import app from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Navbar = () => { 
  const [visible, setVisible] = useState(false); //This is the state to control the visibility of the side bar menu for small screens.
  const { setShowSearch } = useContext(ShopContext); //This is to retrieve the function to show or hide the search bar from the global context.
  const [user, setUser] = useState(null); //This is the state to store the current authenticated user.
  const [userRole, setUserRole] = useState(null); //This is the state to store the user's role
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); //This is the state to control whether the profile drop down is open or not.
  const profileRef = useRef(null); //This is to create a ref to the profile drop down container to detect clicks outside.
  const auth = getAuth(app); //This will initialize firebase auth using the app instance.

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe(); //C;ean up the listener when the component unmounts.
  }, [auth]);

  // Fetch user role if logged in
  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        const userDocRef = doc(db, 'users', user.uid); //This is to get a reference to the user's document in firestore.
        const docSnap = await getDoc(userDocRef); //This is to retrieve the document snapshot.
        if (docSnap.exists()) { //If the document exists, set the user's role.
          setUserRole(docSnap.data().role);
        }
      };
      fetchUserRole();
    } else {
      setUserRole(null); //If no user is authenticated, reset the role to null.
    }
  }, [user]);

  const handleLogout = async () => { //This is the function to handle user logout.
    try {
      await signOut(auth); //This is to signout the user using firebase auth.
      setProfileMenuOpen(false); //This is to close the profile dropdown after logging out.
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close the profile dropdown if click is outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) { //This will check if the click target is outside the profileRef container.
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside); //This is to listen the mousedown events on the document.
    return () => document.removeEventListener('mousedown', handleClickOutside); //This is to clean up the event listener when the component unmounts.
  }, [profileRef]);

  return ( //Navbar container with flex layout to arrange items horizontally.
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to={'/'}>
        <img src={assets.logo} className='w-36' alt="Logo" />
      </Link>
      {/* Nav links with bold text */}
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
        {/* Profile Icon with click-toggle dropdown */}
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
                    <Link onClick={() => setProfileMenuOpen(false)} to="/profile" className="cursor-pointer hover:text-black">My Profile</Link>
                    <Link onClick={() => setProfileMenuOpen(false)} to='/orders' className='cursor-pointer hover:text-black'>Orders</Link>
                    {userRole === 'seller' && (
                      <Link onClick={() => setProfileMenuOpen(false)} to='/seller-dashboard' className='cursor-pointer hover:text-black'>Seller Dashboard</Link>
                    )}
                    <p
                      className='cursor-pointer hover:text-black'
                      onClick={handleLogout}
                    >
                      Logout
                    </p>
                  </>
                ) : (
                  <Link onClick={() => setProfileMenuOpen(false)} to='/login' className='cursor-pointer hover:text-black'>Login</Link>
                )}
              </div>
            </div>
          )}
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            10
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt="Menu"
        />
      </div>
      {/* Sidebar menu for small screens with bold text */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="Back" />
            <p className="font-bold">Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 -pl-6 border font-bold' to='/'>SHOP</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 -pl-6 border font-bold' to='/new'>NEW</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 -pl-6 border font-bold' to='/refurbished'>REFURBISHED</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 -pl-6 border font-bold' to='/following-listings'>FOLLOWING</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 -pl-6 border font-bold' to='/contact'>CONTACT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 -pl-6 border font-bold' to='/saved-listings'>SAVED</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
