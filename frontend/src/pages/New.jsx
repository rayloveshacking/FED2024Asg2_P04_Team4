import React, { useContext, useState, useEffect } from 'react'; //import react and other necessary components.
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const New = () => { 
  const { products, search, showSearch } = useContext(ShopContext); //This is to destructure products, search query and show search flag from shopcontext.
  const [showFilter, setShowFilter] = useState(false); //This is a local state to control the visibility of filter options.
  const [filterProducts, setFilterProducts] = useState([]); //This is a local state to hold the filtered list of products after applying search, category and subcategory filters.
  const [category, setCategory] = useState([]); //This is a local state to hold selected categories for filtering.
  const [subCategory, setSubCategory] = useState([]); ;//This is a local state to hold selected sub categories for filtering.
  const [sortType, setSortType] = useState('relevant'); //This is a local state to hold the current sort type. Default is Relevant.

  const toggleCategory = (e) => { //This is a function to toggle a category in the category filter list, it the category is already selected, it removes it otherwise it adds it.
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => { //This ia a function to toggle a subcategory in the subcategory filter list, similar logic to toggleCategory.
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => { //This is a function that apply filters to the products list based on search text, category and subcategory.
    let productsCopy = products.slice(); //This make a copy of the products array
    if (showSearch && search) { // If the global showSearch flag is true and there is a search query, filter products whose name includes the search query
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) { //If any category filters are selected, filter products by matching the product's category.
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if (subCategory.length > 0) { // If any subcategory filters are selected, filter products by matching the product's subCategory.
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
    }
    setFilterProducts(productsCopy); //This update the local state with the filter products
  };

  const sortProduct = () => { //This is a function to sort the filtered products based on the selected sort type, it sorts the filtered products copy and updates the state.
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price)); //Sort products in ascending order by price.
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price)); // Sort products in descending order by price.
        break;
      default:
        applyFilter(); // For 'relevant' or any other case, re apply filters
        break;
    }
  };

  useEffect(() => { //This useEffect reapply filters whenever category, subCategory, search or showSearch changes.
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  useEffect(() => { // This useEffect resort products whenever the sortType changes.
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-270' : ''}`} src={assets.dropdown_icon1} alt='' />
        </p>
        {/* Filter by Category */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Computers'} onChange={toggleCategory} /> Computers
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Accessories'} onChange={toggleCategory} /> Accessories
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Mobile Devices'} onChange={toggleCategory} /> Mobile Devices
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Laptops'} onChange={toggleSubCategory} /> Laptops
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Desktops'} onChange={toggleSubCategory} /> Desktops
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Mouse'} onChange={toggleSubCategory} /> Mouse
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Keyboards'} onChange={toggleSubCategory} /> Keyboards
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Phone'} onChange={toggleSubCategory} /> Phone
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'NEW'} text2={'COLLECTIONS'} />
          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low To High</option>
            <option value="high-low">Sort by: High To Low</option>
          </select>
        </div>
        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item.id}  // Changed from item._id to item.id
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default New;
