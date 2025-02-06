import React, { useState, useEffect, useContext } from "react"; //import react and other necessary components
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ShopContext } from "../context/ShopContext";
import SaveListingButton from '../components/SaveListingButton';

const Product = () => {
  const { productId } = useParams(); // Extract the productId from the URL using useParams.
  const [productData, setProductData] = useState(null); // This is a local state to hold the fetched product data.
  const [mainImage, setMainImage] = useState(""); //This is a local state to hold the currently displayed main image.
  const { addToCart, currency } = useContext(ShopContext); //This will destructure the addToCart function and currency value from the global shopcontext.

  useEffect(() => { //This useEffect fetch product data from Firestore when the component mounts or productId changes.
    const fetchProduct = async () => {
      const docRef = doc(db, "products", productId); //This will get a reference to the product document in firestore using product id.
      const docSnap = await getDoc(docRef); //This will fetch the document snapshot.
      if (docSnap.exists()) { // If the document exists, update productData state with it's data.
        setProductData({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    };
    fetchProduct(); //This is a function call to fetch the product.
  }, [productId]);

  useEffect(() => { // This useEffect set the main image once productData is loaded and check if productData is available.
    if (
      productData &&
      productData.image &&
      productData.image.length > 0 &&
      !mainImage
    ) {
      setMainImage(productData.image[0]);
    }
  }, [productData, mainImage]);

  return productData ? ( //Render the component based on whether productData is available.
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex flex-col sm:flex-row gap-12 sm:gap-12">
        {/* Image Gallery Section */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full min-h-[100px]">
            {productData.image?.map((item, index) => (
              <img
                key={index}
                src={item}
                alt={`Thumbnail ${index + 1}`}
                className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 ${
                  mainImage === item ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setMainImage(item)}
                onError={(e) => {
                  e.target.style.display = "none";
                  console.error("Failed to load image:", item);
                }}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-1 h-[500px] bg-gray-50 rounded-lg p-4">
            {mainImage ? (
              <img
                src={mainImage}
                className="w-full h-full object-contain"
                alt="Main product view"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
        </div>
        {/* Product Details Section */}
        <div className="flex-1 p-4">
          <h2 className="text-3xl font-bold mb-4">{productData.name}</h2>
          <p className="text-xl text-gray-700 mb-2">
            {productData.price && `${currency} ${productData.price}`}
          </p>
          <p className="mb-4">{productData.description}</p>
          <p className="mb-2">
            <span className="font-semibold">Category:</span>{" "}
            {productData.category}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Subcategory:</span>{" "}
            {productData.subCategory}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Product Type:</span>{" "}
            {productData.type}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Seller:</span>{" "}
            {productData.sellerName && productData.sellerId ? (
              <Link to={`/seller/${productData.sellerId}`} className="text-blue-600 hover:underline">
                {productData.sellerName}
              </Link>
            ) : (
              "Unknown"
            )}
          </p>
          <button
            onClick={() => addToCart(productData)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
          {/* Save Listing Button */}
          <div className="mt-2">
            <SaveListingButton productId={productData.id} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-[500px] flex items-center justify-center">
      <p className="text-gray-500">Product not found</p>
    </div>
  );
};

export default Product;
