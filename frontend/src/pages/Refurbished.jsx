import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets1 } from '../assets/assets1'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Refurbished = () => { 
  const {refurbishedProducts, search, showSearch} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');


  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
      setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else {
      setCategory(prev => [...category, e.target.value])
    }
  }


  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = refurbishedProducts.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category))

    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))

    }

    setFilterProducts(productsCopy);
  }

const sortProduct = () => {

  let fpCopy = filterProducts.slice();
  switch (sortType) {
    case 'low-high':
      setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
      break;
    case 'high-low':
      setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)));
      break;
    
    default:
      applyFilter();
      break;
  }
}

useEffect(()=>{
  applyFilter();
},[category,subCategory,search,showSearch])

useEffect(()=>{
  sortProduct();
},[sortType])

    return (
      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

        {/* Filter Options */}
        <div className='min-w-60'>
          <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-270' : ''}`} src={assets1.dropdown_icon1} alt='' />
          </p>
          {/* Filter by Category */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Computers'} onChange={toggleCategory}/> Computers
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Accessories'} onChange={toggleCategory}/> Accessories
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Mobile Devices'} onChange={toggleCategory}/> Mobile Devices
              </p>
            </div>
          </div>
          {/* SubCategory Filter */}
          <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>TYPES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Laptops'} onChange={toggleSubCategory}/> Laptops
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Desktops'} onChange={toggleSubCategory}/> Desktops
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Mouse'} onChange={toggleSubCategory}/> Mouse
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Keyboards'} onChange={toggleSubCategory}/> Keyboards
              </p>
              <p className='flex gap-2'>
                <input className='w-3' type='checkbox' value={'Phone'} onChange={toggleSubCategory}/> Phone
              </p>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className='flex-1'>
          <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'REFURBISHED'} text2={'COLLECTIONS'} />
            {/* Product Sort */}
            <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low To High</option>
              <option value="high-low">Sort by: High To Low</option>
            </select>
          </div>
          {/* Map Products */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {
              filterProducts.map((item,index)=>(
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image}/>
              ))
            }
          </div>
        </div>
      </div>
    )

}

export default Refurbished