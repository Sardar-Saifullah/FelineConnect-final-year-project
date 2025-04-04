import FlashSaleItem from "../common/components/FlashSaleItem";
import PropTypes from "prop-types";
import RedTitle from "../common/components/RedTitle";
import ViewAll from "../common/components/ViewAll";

const BestSelling = ({ items }) => {
  return (
    <>
      <div className="mx-2">
        <RedTitle title="This Month" />

        <div className="flex justify-between items-center md:mr-6 md:mb-4">
          <h2 className="text-lg  md:text-3xl font-semibold ">
            Best Selling Products
          </h2>
          <ViewAll name="View All" />
        </div>
        <div className="relative mt-10">
          <div className="flex flex-row gap-2 md:gap-8 overflow-x-hidden hover:overflow-x-auto xl:hover:overflow-x-hidden  transition-transform duration-300 transform  focus:outline-none ">
            {items.slice(0, 4).map((item) => (
              <FlashSaleItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
      <hr className="mx-40 border-gray-300 md:mt-16" />
    </>
  );
};

BestSelling.propTypes = {
  items: PropTypes.array.isRequired,
};

export default BestSelling;
