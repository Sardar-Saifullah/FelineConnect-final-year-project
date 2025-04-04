import { useState, useEffect } from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import FlashSaleItem from "../components/common/components/FlashSaleItem";
import RedButton from "../components/common/components/RedButton";
import WhiteButton from "../components/common/components/WhiteButton";
import Loader from "../components/common/components/Loader";
import { useProducts, useProductCategories } from "../actions/query";
import { client } from "../lib/client.js";
const AllProducts = () => {
  const limit = 10;
  const [page, setPage] = useState(1); // Control the page manually
  const {
    data,
    error,
    isLoading: loading,
    isFetching,
    isPreviousData,
  } = useProducts(page, limit); // Fetch products based on page and limit
  const { data: categoriesData, isLoading } = useProductCategories();

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0); // Keep track of total pages
  const [productsData, setProductsData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const handleSearch = async () => {
    if (!search) {
      setProductsData(data?.products || []);
      return;
    }
    try {
      const res = await client.post("/products/search", {
        name: search,
      });
      const temp = res.data;
      setProductsData(temp || []);
    } catch (e) {
      console.log(e);
      alert("invalid error");
    }
  };
  const handleFilter = async (option) => {
    if (!option) {
      setProductsData(data?.products || []);
      return;
    }
    try {
      const res = await client.post("/products/filter/category/id", {
        categoryId: option,
      });
      const temp = res.data;
      setProductsData(temp);
    } catch (e) {
      console.log(e);
      alert("invalid error");
    }
  };
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
    <div className="mt-40 flex flex-col gap-5">
      <Typography variant="h3" align="center" gutterBottom>
        Our Products
      </Typography>
      <div className="flex items-center justify-between flex-wrap w-full md:px-10 py-5">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            required
            className="md:w-[350px] max-md:w-full rounded bg-gray-100 bg-opacity-100 px-4 py-4 text-gray-400 text-base focus:border outline-none focus:border-gray-300  "
          />
          <div onClick={handleSearch}>
            <WhiteButton name="Search" />
          </div>
          {(search || filterOption) && (
            <div
              onClick={() => {
                setFilterOption("");
                setSearch("");
                setProductsData(data.products || []);
              }}
            >
              <WhiteButton name="Reset" />
            </div>
          )}
        </div>
        {categoriesData && (
          <FormControl>
            <InputLabel id="demo-simple-select-label">
              Filter by category
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterOption}
              label="Filter by category"
              className="w-[300px]"
              onChange={(e) => {
                handleFilter(e.target.value);
                setFilterOption(e.target.value);
              }}
            >
              {categoriesData?.map((cat) => {
                return (
                  <MenuItem value={cat.id} key={cat.id}>
                    {cat.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      </div>
      <div className="px-10">
        <Grid container spacing={6} justifyContent="start" alignItems="start">
          {loading || isFetching
            ? Array.from({ length: 10 }).map((_, index) => (
                <Grid item key={index}>
                  <Loader />
                </Grid>
              ))
            : productsData?.map((item) => (
                <Grid item key={item.id}>
                  <FlashSaleItem item={item} />
                </Grid>
              ))}
        </Grid>
      </div>

      {/* Pagination Buttons */}
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

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-around items-center md:mx-12">
        <Link to="..">
          <WhiteButton name="Back to Home Page" />
        </Link>
        {/* <Link to="/category">
          <RedButton name="Explore By Category" />
        </Link> */}
      </div>
    </div>
  );
};

export default AllProducts;
