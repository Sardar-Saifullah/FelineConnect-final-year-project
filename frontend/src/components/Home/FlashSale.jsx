import FlashSaleItem from "../common/components/FlashSaleItem";
import { useState, useEffect } from "react";
import RedTitle from "../common/components/RedTitle";
import Arrows from "../common/components/Arrows";
import ViewAll from "../common/components/ViewAll";
import calculateTimeLeft from "../common/functions/calculateTimeLeft";
import { ITEMS } from "../common/functions/items";
import { useProducts } from "../../actions/query";
const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(new Date("2024-10-27T00:00:00"))
  );
  const limit = 10;
  const [page, setPage] = useState(1); // Control the page manually
  const {
    data,
    error,
    isLoading: loading,
    isFetching,
    isPreviousData,
  } = useProducts(page, limit); // Fetch products based on page and limit

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Keep track of total pages
  const [productsData, setProductsData] = useState([]);

  // Update the products and pagination details when data changes
  useEffect(() => {
    if (data) {
      setTotalProducts(data?.totalProducts || 0);
      setProductsData(data?.products || []);
      setTotalPages(data?.totalPages || 0); // Set total pages from API response
    }
  }, [data]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // Go to next page
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1); // Go to previous page
    }
  };

  return (
    <div className=" p-4 ">
      <RedTitle title="Today’s" />
      <div className="flex md:justify-between items-center md:mr-6 md:mb-4">
        <div className="flex gap-10 md:gap-20 flex-col md:flex-row ">
          <h2 className="text-2xl md:text-3xl font-semibold ">Today’s</h2>
          <div className="font-inter font-bold text-2xl md:text-3xl relative">
            <span className="absolute text-xs font-poppins bottom-full left-0.5">
              Flash Sales
            </span>
            <span>{timeLeft.days}</span>
            <span className="text-red-400 mx-4">:</span>
            <span className="absolute text-xs font-poppins bottom-full left-1/5">
              Days
            </span>
            <span>{timeLeft.hours}</span>
            <span className="text-red-400 mx-4">:</span>
            <span className="absolute text-xs font-poppins bottom-full">
              Hours
            </span>
            <span>{timeLeft.minutes}</span>
            <span className="text-red-400 mx-4">:</span>
            <span className="absolute text-xs font-poppins bottom-full left-full">
              Minutes
            </span>
            <span className="absolute ">{timeLeft.seconds}</span>
          </div>
        </div>
        {/* <Arrows /> */}
      </div>

      <div className="scrollbar relative  md:overflow-x-hidden hover:overflow-scroll  overflow-y-hidden flex justify-start items-center h-[500px] md:h-[400px] ">
        {productsData.map((item, index) => (
          <FlashSaleItem
            key={item.id}
            item={item}
            index={index}
            // totalItems={saleItems.length}
            // stars={item.stars}
            // rates={item.rates}
          />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <ViewAll name="View All Products" />
      </div>
      <hr className="mx-40 border-gray-300 md:mt-16" />
    </div>
  );
};

export default FlashSale;
