import FlashSaleItem from "../common/components/FlashSaleItem";
import PropTypes from "prop-types";
import RedTitle from "../common/components/RedTitle";
import ViewAll from "../common/components/ViewAll";
import { Grid } from "@mui/material";

const AllProducts = ({ items }) => {
  return (
    <>
      <div className="mx-2 xl:mx-0 my-12">
        <RedTitle title="Our Products" />
        <div className="flex justify-between items-center md:mr-6 md:mb-4">
          <h2 className="text-xl md:text-3xl font-semibold ">
            Explore Our Products
          </h2>
        </div>
        <div className="relative mt-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform ">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            {items.map((item, index) => (
              <Grid item key={item.id}>
                <FlashSaleItem item={item} index={index} />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div className=" flex justify-center">
        <ViewAll name="View All Products" />
      </div>
    </>
  );
};

AllProducts.propTypes = {
  items: PropTypes.array.isRequired,
};

export default AllProducts;
