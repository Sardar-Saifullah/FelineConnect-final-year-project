/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import FlashSaleItem from "../common/components/FlashSaleItem";
import RedTitle from "../common/components/RedTitle";
import ViewAll from "../common/components/ViewAll";
import { Grid } from "@mui/material";
import { useProducts } from "../../actions/query";
const RelatedItems = ({ selectedProduct }) => {
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
    <>
      <div className="mx-auto md:mx-2">
        <RedTitle title="Related Items" />
        <div className="relative mt-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform ">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {productsData.map((item, index) => (
              <Grid item key={item.id}>
                <FlashSaleItem
                  item={item}
                  index={index}
                  // totalItems={productsData.length}
                  // stars={item.stars}
                  // rates={item.rates}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div className="mt-8 flex justify-center">
        <ViewAll name="View All Products" />
      </div>
    </>
  );
};

export default RelatedItems;
