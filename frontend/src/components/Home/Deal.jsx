import calculateTimeLeft from "../common/functions/calculateTimeLeft";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ITEMS } from "../common/functions/items";
import { useProducts } from "../../actions/query";

const Deal = () => {
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
    <div className=" flex gap-10 md:my-10 mt-10 items-center justify-center flex-col-reverse md:flex-row  min-h-[500px] bg-[#EF4444] text-white">
      <div className="flex flex-col gap-5 items-center md:items-start  md:mx-12">
        {/* <h3 className="text-green text-sm">Categories</h3> */}
        <h2 className="xl:w-[500px] text-center md:text-start text-2xl sm:text-3xl lg:text-5xl font-semibold font-inter">
          Enhance Your Buying Experience
        </h2>
        {/* <div className="font-semibold text-base flex flex-row gap-6 text-black">
          <div className="flex flex-col  items-center justify-center py-3 bg-white rounded-full">
            <span>{timeLeft.days}</span>
            <span className=" font-light text-xs w-[62px] text-center">
              Days
            </span>
          </div>
          <div className="flex flex-col  items-center justify-center py-3 bg-white rounded-full">
            <span>{timeLeft.hours}</span>
            <span className=" font-light text-xs w-[62px] text-center">
              Hours
            </span>
          </div>
          <div className="flex flex-col  items-center justify-center py-3 bg-white rounded-full">
            <span>{timeLeft.minutes}</span>
            <span className=" font-light text-xs w-[62px] text-center">
              Minutes
            </span>
          </div>
          <div className="flex flex-col  items-center justify-center py-3 bg-white rounded-full">
            <span>{timeLeft.seconds}</span>
            <span className=" font-light text-xs w-[62px] text-center">
              Seconds
            </span>
          </div>
        </div> */}
        <Link to={{ pathname: `/allProducts` }}>
          <button className="bg-[#EF4444]/40 border-[1px] border-white mb-8 py-4 px-12 rounded  ease-in-out  duration-300 transform hover:scale-105 hover:-translate-y-1">
            <span> Buy Now!</span>
          </button>
        </Link>
      </div>
      <div className="mt-4">
        <Link to={{ pathname: `/allProducts` }}>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/cat-seating-near-food-bowl-illustration-download-in-svg-png-gif-file-formats--international-day-pack-animal-illustrations-4714860.png"
            alt="Deal"
            loading="lazy"
            className="transition-transform duration-300 transform hover:-translate-y-4 hover:scale-110 hover:motion-safe:animate-pulse"
          />
        </Link>
      </div>
    </div>
  );
};

export default Deal;
