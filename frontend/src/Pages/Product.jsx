import { useEffect, useState } from "react";
import RelatedItems from "../components/Product/RelatedItems";
import ActiveLastBreadcrumb from "../components/common/components/Link";
import RedButton from "../components/common/components/RedButton";
import WishlistIcon from "../components/common/components/WishlistIcon";
import { useCart } from "../context/CartContext";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import NotFound from "./NotFound";
import {
  useGetProductById,
  useGetProductByTitle,
  useProductCategories,
} from "../actions/query";
import RelatedReviews from "../components/Product/RelatedReviews";
import { Rating } from "@mui/material";
import AddToCart from "../components/common/components/AddToCart";
const Product = () => {
  const { handleIncrease, handleDecrease } = useCart();
  const [quantity, setQuantity] = useState(0);
  let params = useParams();
  const { id } = params;
  console.log("these are params ", params);
  const { data: selectedProduct, isLoading } = useGetProductById(id ?? "");
  const { data: categories, isLoading: categoriesLoading } =
    useProductCategories();

  const handleDecreaseFunc = () => {
    handleDecrease(selectedProduct);
    setQuantity((prev) => prev - 1);
  };

  const handleIncreaseFunc = () => {
    handleIncrease(selectedProduct);
    setQuantity((prev) => prev + 1);
  };

  const [isImageFullScreen, setIsImageFullScreen] = useState(false);

  const handleImageClick = () => {
    setIsImageFullScreen(!isImageFullScreen);
  };
  const getMyCategory = () => {
    const myCurrentCategory = categories?.filter((cat) => {
      return cat.id === selectedProduct?.categoryId;
    });
    return myCurrentCategory[0]?.name || "";
  };
  const { handleAddToCart, isInCart } = AddToCart({
    item: selectedProduct ? selectedProduct : {},
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {selectedProduct ? (
        <div className="flex flex-col mx-4 md:mx-32 mt-48">
          <div className="mx-auto  flex flex-col gap-10">
            {!categoriesLoading && (
              <ActiveLastBreadcrumb
                path={`My Account/${getMyCategory()}/${selectedProduct.title}`}
              />
            )}
            <div className="flex flex-col md:flex-row  gap-16">
              <div className="flex flex-col-reverse md:flex-row gap-8">
                <div className="flex  flex-row md:flex-col gap-4">
                  {[...Array(4)].map((_, index) => (
                    <motion.div
                      role="button"
                      key={index}
                      className="relative flex items-center justify-center bg-zinc-100 rounded md:pt-12 md:p-8 md:h-[138px] md:w-[170px]"
                      onClick={handleImageClick}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.8 }}
                    >
                      <img
                        src={selectedProduct.imageSrc}
                        alt={selectedProduct.title}
                        className="transform transition-transform duration-300 hover:scale-105 focus:outline-none w-full h-full"
                      />
                    </motion.div>
                  ))}
                </div>
                {/* Main image */}
                {/* <button> */}
                <motion.div
                  role="button"
                  className="relative flex items-center justify-center bg-zinc-100 w-full rounded md:pt-12 md:p-8 md:h-[600px] md:w-[500px]"
                  onClick={handleImageClick}
                >
                  <img
                    src={selectedProduct.imageSrc}
                    alt={selectedProduct.title}
                    className="transform transition-transform duration-300 hover:scale-105 focus:outline-none w-full max-h-full"
                  />
                </motion.div>
                {/* </button> */}
              </div>
              <div className="flex gap-5 flex-col">
                <div className="flex gap-4 flex-col">
                  <h2 className="text-xl md:text-2xl font-bold ">
                    {selectedProduct.title}
                  </h2>
                  {/* <div className="flex  text-gray-500 text-sm gap-2 items-center ">
                    {renderStars()}
                    <span>
                      ({selectedProduct.rates} Reviews)
                      <span className="mr-4 "></span>|{" "}
                      <span className="ml-4 text-green">In Stock</span>
                    </span>
                  </div> */}
                  <div className="flex gap-10">
                    <p className="text-gray-800 text-xl md:text-2xl font-inter">
                      ${selectedProduct.price}.00
                    </p>
                    {/* <RatingComp text="Review" item={selectedProduct} />{" "} */}
                  </div>
                  <p className="text-gray-800 w-full md:w-[373px] text-xs md:text-sm">
                    {selectedProduct.details}
                  </p>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Rating
                    value={selectedProduct?.averageRating}
                    precision={0.1}
                  />
                </div> */}
                <hr className="mx-30  border-gray-300" />
                {/* <div className="font-inter text-xl">Colors: </div>
                <div className="font-inter text-xl flex gap-4">
                  Size
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className={`border-2 w-8 h-8 hover:bg-red-400 hover:text-white border-gray-400 rounded text-sm ${
                        selectedSize === size ? "bg-red-600 text-white" : ""
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div> */}
                <div className="font-inter text-xl flex gap-4">
                  <div className="border-2 w-[160px] border-gray-400 rounded text-xl font-semibold flex justify-between items-center">
                    <button
                      onClick={handleDecreaseFunc}
                      className="border-r-2  hover:bg-red-500 hover:text-white border-gray-400 rounded p-3"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 12H4"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    {quantity}
                    <button
                      onClick={handleIncreaseFunc}
                      className="border-l-2  hover:bg-red-500 hover:text-white border-gray-400 rounded p-3 "
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 20V12M12 12V4M12 12H20M12 12H4"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {quantity === 0 ? (
                    <RedButton name="Add to Card" disabled={true} />
                  ) : (
                    <>
                      <button
                        onClick={handleAddToCart}
                        className={` bg-black text-white py-2 px-4  duration-300  hover:bg-gray-800 focus:outline-none ${
                          isInCart && "bg-red-500"
                        }`}
                      >
                        {isInCart ? "Remove from Cart" : "Add to Cart"}
                      </button>
                      {/* <Link to="/checkout">
                      <RedButton name="Buy Now" />
                    </Link> */}
                    </>
                  )}
                  <WishlistIcon selectedProduct={selectedProduct} />
                </div>
                {/* <div className="border-2 border-gray-400 w-full h-44 flex flex-col py-6 mt-4 rounded">
                  <div className="flex flex-row gap-4 justify-start items-center ml-4 mb-4">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                
                    </svg>
                    <div className="flex flex-col gap-2 font-semibold">
                      <span className="text-base">Free Delivery</span>
                      <span className="text-xs underline">
                        Enter your postal code for Delivery Availability
                      </span>
                    </div>
                  </div>
                  <hr className="mx-full border border-gray-400" />
                  <div className="flex flex-row gap-4 justify-start items-center ml-4 mt-4">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                  
                    </svg>
                    <div className="flex flex-col gap-2 font-semibold">
                      <span className="text-base">Return Delivery</span>
                      <span className="text-xs">
                        Free 30 Days Delivery Returns.Details
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
            <RelatedReviews selectedProduct={selectedProduct} />
            <RelatedItems selectedProduct={selectedProduct} />
          </div>
          <AnimatePresence>
            {isImageFullScreen && (
              <motion.div
                className="backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={handleImageClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: "100vw", height: "100vh" }} // Set full-screen width and height
              >
                <motion.img
                  src={selectedProduct.imageSrc}
                  alt={selectedProduct.title}
                  className="w-full h-auto max-h-[50vh] md:max-w-[50vw]"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default Product;
