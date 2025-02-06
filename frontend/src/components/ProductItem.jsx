// /src/components/ProductItem.jsx
import React, { useContext } from 'react'; //import react and other necessary components.
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import SaveListingButton from './SaveListingButton';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  // Use the first image if image is an array.
  const imageSrc = Array.isArray(image) ? image[0] : image;

  return (
    <div className="relative">
      <Link to={`/product/${id}`} className='text-gray-700 cursor-pointer'>
        <div className='overflow-hidden w-40 h-40 sm:w-48 sm:h-48'>
          <img
            className='object-cover w-full h-full hover:scale-110 transition ease-in-out'
            src={imageSrc}
            alt={name}
            onError={(e) => {
              e.target.src = 'path/to/default/image.png';
            }}
          />
        </div>
      </Link>
      {/* Save Button Overlay */}
      <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
        <SaveListingButton productId={id} />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency} {price}</p>
    </div>
  );
};

export default ProductItem;
