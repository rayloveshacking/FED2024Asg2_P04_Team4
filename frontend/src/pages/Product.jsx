import React, { useContext, useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { products, refurbishedProducts } = useContext(ShopContext);
  
  const [productData, setProductData] = useState(null);
  const [mainImage, setMainImage] = useState('');

  // Determine product type from URL path
  const productType = location.pathname.includes('/refurbished/') ? 'refurbished' : 'new';

  useEffect(() => {
    const fetchProduct = async () => {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            setProductData({ id: docSnap.id, ...docSnap.data() });
        } else {
            console.log('No such document!');
        }
    };

    fetchProduct();
}, [productId]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Image Gallery */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          {/* Thumbnails */}
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full min-h-[100px]'>
            {productData.image?.map((item, index) => (
                <img 
                  src={item}
                  key={index}
                  className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2
                    ${mainImage === item ? 'border-blue-500' : 'border-transparent'}`}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setMainImage(item)}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    console.error('Failed to load image:', item);
                  }}
                />
            ))}
          </div>

          {/* Main Image */}
          <div className='flex-1 h-[500px] bg-gray-50 rounded-lg p-4'>
            {mainImage ? (
              <img
                src={mainImage}
                className='w-full h-full object-contain'
                alt="Main product view"
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-gray-400'>
                No image available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className='h-[500px] flex items-center justify-center'>
      <p className='text-gray-500'>Product not found</p>
    </div>
  );
};

export default Product;