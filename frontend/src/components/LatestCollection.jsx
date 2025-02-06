import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'; //This is to import the global shopcontext to access products and shared state.
import Title from './Title'; //This will import the title components for section headings.
import ProductItem from './ProductItem'; //This will import the product item component to display individual product details

const LatestCollection = () => {
    const { products } = useContext(ShopContext); //This will destructure the products array from the shopcontext.
    const [latestProducts, setLatestProducts] = useState([]); //This is the local state to store the subset of products that will be displayed. For this we want to display the latest 10 products.

    useEffect(() => { //This is the useEffect hook which will run everytime the products array changes. This effect will slice the first 10 products and set them as the latest products.
      setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            The latest and greatest products from our store. Find the perfect device for your loved ones.
        </p>
      </div>
        {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                latestProducts.map((item,index)=>( //Map through the latestProducts array and render a productitem for each product.
                    <ProductItem key={index} id={item.id} image={item.image} name={item.name} price={item.price}/>
                ))
            }
        </div>
    </div>
  )
}

export default LatestCollection
