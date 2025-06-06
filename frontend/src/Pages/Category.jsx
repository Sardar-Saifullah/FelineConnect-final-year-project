import { useState } from "react";
import { Grid, Typography, Menu, MenuItem, Button } from "@mui/material";
import { Link } from "react-router-dom";
import FlashSaleItem from "../components/common/components/FlashSaleItem";
import { ITEMS } from "../components/common/functions/items";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ViewAll from "../components/common/components/ViewAll";
import WhiteButton from "../components/common/components/WhiteButton";

const Category = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Technology");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setAnchorEl(null);
  };

  // Filter ITEMS based on the selected category
  const filteredItems = ITEMS.filter((item) => item.type === selectedCategory);

  return (
    <div className="container mx-auto mt-40 flex flex-col gap-5">
      <Typography variant="h3" align="center" gutterBottom>
        Explore By Category
      </Typography>
      <div className="flex justify-center mb-4">
        <Button
          style={{
            backgroundColor: "rgba(219, 68, 68, 1)",
            color: "white",
            fontWeight: "bold",
            padding: "10px 20px",
            borderRadius: "5px",
            textTransform: "capitalize",
            boxShadow: "0 2px 4px rgba(0, 0, 0, .2)",
          }}
          variant="contained"
          startIcon={<ArrowDropDownIcon />}
          onClick={handleMenuOpen}
        >
          Choose By Category
        </Button>

        <Menu
          id="category-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-1 flex items-center justify-center mx-1"
        >
          {["General", "Technology", "Gaming", "Clothes", "New Arrival"].map(
            (category) => (
              <MenuItem
                className="w-36"
                key={category}
                onClick={() => handleCategorySelect(category)}
              >
                <span className="text-xl mx-auto">{category}</span>
              </MenuItem>
            )
          )}
        </Menu>
      </div>
      <div className="relative mx-2 my-10 flex flex-row gap-2 md:gap-12 transition-transform duration-300 transform ">
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {filteredItems.map((item, index) => (
            <Grid item key={item.id}>
              <FlashSaleItem
                item={item}
                index={index}
                totalItems={filteredItems.length}
                stars={item.stars}
                rates={item.rates}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="mt-6 flex justify-center gap-5 md:gap-20 items-center md:mx-12 ">
        <Link to="..">
          <WhiteButton name="Back to Home Page" />
        </Link>
        <ViewAll name="View All Products" />
      </div>
    </div>
  );
};

export default Category;
