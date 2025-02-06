import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext'; //import the global shopcontext for state management.
import Title from './Title'; //import a reusable title component for headings.
import ProductItem from './ProductItem'; //import a reusable product item component to display individual products.

const BestSeller = () => {
  const { products, refurbishedProducts } = useContext(ShopContext); //destructure products and refurbished products from the global context. These array contain all products in the shop.
  const [bestSeller, setBestSeller] = useState([]); //This is a state to hold the filtered list of best-selling products.

  // Combine new and refurbished products into one array.
  const allProducts = [...products, ...refurbishedProducts]; //This will allow us to filter best sellers from the entire product collection.

  useEffect(() => { //This is a hook to filter out the best-selling products whenever products or refurbishedProducts change.
    const best = allProducts.filter((item) => item.bestseller); //Filter the combined product list to get only items marked as bestseller.
    setBestSeller(best.slice(0, 5)); //set the bestSeller state to the first 5 best selling products.
  }, [products, refurbishedProducts]); //This effect reruns when either of these dependencies change.

  return ( 
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Simply the best from our premium store. Find what's trending and make it yours.
        </p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y--6'>
        {bestSeller.map((item, index) => (
          //This will render a ProductItem Component for each best selling product and pass the product details as props.
          <ProductItem
            key={index}
            id={item.id}  
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
