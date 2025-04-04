/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import PropTypes from "prop-types";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WishlistIcon from "./WishlistIcon";
import AddToCart from "./AddToCart";
import RatingComp from "./Rating";

const FlashSaleItem = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const storedQuantity = JSON.parse(localStorage.getItem("cartItems"))?.find(
      (anItem) => anItem.id == item.id
    )?.quantity;

    if (storedQuantity === 0) {
      item.quantity = 0;
    } else {
      item.quantity = storedQuantity || 0;
    }
  }, [item]);

  const { handleAddToCart, isInCart } = AddToCart({ item }); // Use AddToCart component to get handleAddToCart and isInCart

  return (
    <div className="relative mx-2 ">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative rounded flex items-center justify-center bg-zinc-100 w-[270px] h-80 md:h-60 transform transition-transform duration-300 hover:scale-105 focus:outline-none hover:-translate-y-2"
      >
        {isHovered && (
          <button
            onClick={handleAddToCart}
            className={`z-10 absolute bottom-0 left-0 right-0 bg-black text-white py-2 px-4  duration-300  hover:bg-gray-800 focus:outline-none ${
              isInCart && "bg-red-500"
            }`}
          >
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        )}

        <Link to={{ pathname: `/allProducts/${item.id}` }} key={item.id}>
          <img
            loading="lazy"
            src={item.imageSrc}
            alt={item.name}
            className="hover:animate-pulse h-52 w-full object-contain"
          />
        </Link>

        <WishlistIcon selectedProduct={item} style="absolute top-3 right-3" />
      </div>
      <div className="flex md:items-start items-center flex-col max-w-[270px]">
        <h3 className="text-lg font-base mt-4">{item.title}</h3>
        <p className="text-red-500  text-sm font-semibold line-clamp-2">
          ${item.price}
          {item.discount && (
            <span className="ml-2 text-gray-500 text-sm font-semibold line-through">
              ${item.price?.toString()?.toFixed()}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

FlashSaleItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};

export default FlashSaleItem;
