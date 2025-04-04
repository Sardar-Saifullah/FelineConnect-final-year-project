/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CheckoutCartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  return (
    <div className=" flex flex-row justify-between items-center relative">
      <div className="flex items-center gap-2 ">
        <div className="flex ">
          <Link to={{ pathname: `/allProducts/${item.title}` }} key={item.id}>
            <img
              loading="lazy"
              src={item.imageSrc}
              alt={item.title}
              className="w-14 h-14  "
            />
          </Link>
        </div>
        <div>
          <p className="text-xs md:text-base md:absolute">{item.title}</p>
        </div>
      </div>
      <div className="flex items-center absolute right-0 pb-4">
        <p className="text-gray-500">
          ${item.price}
          {quantity >= 1 ? ` x ${quantity}` : ""}
        </p>
      </div>
    </div>
  );
};

export default CheckoutCartItem;
