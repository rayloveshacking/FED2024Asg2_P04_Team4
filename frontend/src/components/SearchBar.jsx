import React, { useContext, useState, useEffect } from 'react' //import react and other necessary components.
import {ShopContext} from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom'; //This will import the useLocation from React router to get the current URL path.

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext); //This will destructure global state values and setters from ShopContext.
    const [visible, setVisible] = useState(false) //This is the localstate to control visibility based on the current route.
    const location = useLocation(); //This will get the current location using useLocation hook.

    useEffect(() => { //This useEffect hook will determine whether the searchbar should be visible based on the current path, if the path includes 'new' or 'refurbished' the search bar will become visible.
        if (location.pathname.includes('new') || location.pathname.includes('refurbished')) {
            setVisible(true);
        } else {
            setVisible(false)
        }
    }, [location]); //This will run the effect whenever the location changes.
    
    return showSearch && visible ? ( //This is to conditionally render the search bar only if both the global 'showSearch' flag and the local 'visible' state are true. Otherwise render null.
        <div className='border-t border-b bg-gray-50 text-center'>
            <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
                <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm' type='text' placeholder='Search' />
                <img className='w-4' src={assets.search_icon} alt="" />
            </div>
            <img onClick={()=>setShowSearch(false)} className='inline w-3 cursor-pointer' src={assets.cross_icon} alt="" />
        </div>
    ) : null;
}

export default SearchBar;