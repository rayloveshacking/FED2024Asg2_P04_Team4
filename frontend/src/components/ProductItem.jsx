import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({id,image,name,price, isRefurbished}) => {

    const {currency} = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/${isRefurbished ? 'refurbished' : 'product'}/${id}`}>
      <div className='overflow-hidden w-40 h-40 sm:w-48 sm:h-48'>
        <img className='object-cover w-full h-full hover:scale-110 transition ease-in-out' src={image[0]} alt='' />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency} {price}</p>
    </Link>
  )
}

export default ProductItem
