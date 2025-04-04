/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import RedTitle from "../common/components/RedTitle";
import { useProductReview, useProducts } from "../../actions/query";
import { Button, Rating } from "@mui/material";
import { AuthContext } from "../../Auth/firebase";
import { client } from "../../lib/client";
const RelatedReviews = ({ selectedProduct }) => {
  const { currentUser } = useContext(AuthContext);
  const limit = 10;
  const [page, setPage] = useState(1); // Control the page manually
  const { data, refetch, error, isLoading, isFetching, isPreviousData } =
    useProductReview(page, limit, selectedProduct.id); // Fetch products based on page and limit

  const [totalProdReviews, setTotalProdReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Keep track of total pages
  const [prodReviewData, setProdReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Update the products and pagination details when data changes
  useEffect(() => {
    if (data) {
      setTotalProdReviews(data?.pagination?.totalReviews || 0);
      setProdReviewData(data?.reviews || []);
      setTotalPages(data?.pagination?.totalPages || 0); // Set total pages from API response
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
  const renderStars = (rate) => {
    const stars = [];
    for (let i = 0; i < rate; i++) {
      // Determine star color based on index and item.stars
      const starColor = "#FFAD33"; // Orange if index < item.stars, gray otherwise
      stars.push(
        <svg
          key={i}
          width="16"
          height="15"
          viewBox="0 0 16 15"
          fill={starColor}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" />
        </svg>
      );
    }
    return stars;
  };
  const handleSubmit = async () => {
    if (!selectedProduct.id || !currentUser.id || !rating || !comment) {
      alert("Insuffient details");
      return;
    }
    try {
      setLoading(true);
      const res = await client.post("/reviews/create", {
        rating,
        comment,
        userId: currentUser.id,
        productId: selectedProduct.id,
      });
      refetch();
      setRating(0);
      setComment("");
    } catch (e) {
      console.log(e);
      alert("invalid error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="mx-auto md:mx-2">
        <RedTitle title="Reviews" />
        <div className="relative mt-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform ">
          <div className="flex flex-col items-start w-full">
            {prodReviewData?.length > 0 ? (
              prodReviewData.map((item, index) => (
                <div
                  item
                  key={item.id}
                  className="flex flex-col items-start gap-2 pt-2 pb-7 border-b-gray-400/40 border-b-[1px] w-full"
                >
                  <div className="flex flex-row items-start gap-2">
                    <img
                      src={
                        item?.User?.profileImage ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      }
                      width={50}
                      height={50}
                      alt="profile"
                      className="object-cover rounded-full"
                    />
                    <div className="flex flex-col gap-2">
                      <h1 className="font-[500]">{item.User.username}</h1>
                      <div className="flex items-center gap-2">
                        {renderStars(item?.rating || 0)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400">{item.comment}</p>
                </div>
              ))
            ) : (
              <>
                <p className="text-gray-400">No Review found</p>
              </>
            )}
            <div className="flex items-center gap-2 justify-center">
              {page > 1 && (
                <button
                  onClick={handlePrevPage}
                  type="button"
                  className="md:mx-auto text-center rounded-md px-5 py-3 mt-8 shadow hover:shadow-md active:shadow-inner transition
            hover:bg-gray-50 border text-[#696A75] hover:text-[#696A75] border-[#696A75] hover:border-[#696A75]
            hover:scale-105 hover:-translate-y-2 transform  duration-300 ease-in-out"
                >
                  Prev
                </button>
              )}
              {page < totalPages && (
                <button
                  onClick={handleNextPage}
                  type="button"
                  className="md:mx-auto text-center rounded-md px-5 py-3 mt-8 shadow hover:shadow-md active:shadow-inner transition
            hover:bg-gray-50 border text-[#696A75] hover:text-[#696A75] border-[#696A75] hover:border-[#696A75]
            hover:scale-105 hover:-translate-y-2 transform  duration-300 ease-in-out"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {currentUser && (
        <div className="mt-8 flex flex-col justify-start">
          <h1 className="text-[24px] font-[600] pb-4">Do a Rating</h1>
          <Rating
            name="product-rating"
            value={rating}
            size="large"
            precision={1}
            onChange={(e, value) => {
              setRating(value);
            }}
          />
          <div className="w-full">
            <input
              type="text"
              className="border-b-[1px] outline-none p-4 md:w-[600px] max-md:w-full"
              placeholder="Write your review"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            type="button"
            className="text-center rounded-md px-5 py-3 mt-8 shadow hover:shadow-md active:shadow-inner transition w-[160px]
            hover:bg-gray-50 border text-[#696A75] hover:text-[#696A75] border-[#696A75] hover:border-[#696A75]
            hover:scale-105 hover:-translate-y-2 transform  duration-300 ease-in-out"
          >
            {loading ? "loading..." : "Post Review"}
          </button>
        </div>
      )}
    </>
  );
};

export default RelatedReviews;
