import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import FlashSaleItem from "../components/common/components/FlashSaleItem";
import { ITEMS } from "../components/common/functions/items";
import RedTitle from "../components/common/components/RedTitle";
import WhiteButton from "../components/common/components/WhiteButton";
import { useState } from "react";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion"; // Import motion from Framer Motion for animations

function Wishlist() {
  const { wishlistItems } = useWishlist();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [massage, setMassage] = useState("");
  const [severity, setSeverity] = useState("success");
  const { moveAllToCart } = useCart();
  let relatedItems;

  const handleClick = () => {
    const state = moveAllToCart(wishlistItems);
    if (wishlistItems.length === 0 || wishlistItems === null) {
      setMassage("No items to move to the cart!");
      setSeverity("info");
    } else {
      if (state) {
        setMassage("Items moved to the cart successfully!");
        setSeverity("success");
      } else {
        setMassage("Items already in the cart!");
        setSeverity("info");
      }
    }
    setTimeout(() => {
      setSnackbarOpen(true);
    }, 500);
  };

  // const wishlistTypes = new Set(wishlistItems.map((item) => item.type));
  // const getRelatedItems = () => {
  //   relatedItems = ITEMS.filter(
  //     (item) =>
  //       wishlistTypes.has(item.type) &&
  //       !wishlistItems.some((wish) => wish.id === item.id)
  //   ).slice(0, 5);
  //   if (!relatedItems || !relatedItems.length) {
  //     relatedItems = ITEMS.filter((item) => item.price > 1000).slice(0, 5);
  //   }
  //   return relatedItems;
  // };
  // getRelatedItems();
  return (
    <div className="flex flex-col md:mx-32 mt-28">
      <div className="mx-auto md:mx-2 my-20">
        <div className="flex justify-around md:justify-between items-center md:mr-6 mb-12">
          <h2 className="text-lg">Wishlist ({wishlistItems.length})</h2>

          <WhiteButton
            name="Move All to Bag"
            onClick={handleClick}
            disabled={
              wishlistItems.length === 0 ||
              wishlistItems === null ||
              snackbarOpen === true
            }
          />
        </div>

        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {wishlistItems.map((item, index) => (
            <Grid item key={item.id} xs={0} sm={6} md={4} lg={3}>
              <FlashSaleItem
                item={item}
                // index={index}
                // totalItems={wishlistItems.length}
                // stars={item.stars}
                // rates={item.rates}
                // isInWishlistPage={true}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      {/* <>
        <div className="flex justify-between items-center md:mr-6 mx-4 ">
          <RedTitle title="Just for you" color="black" />
          <Link to="/allProducts">
            <WhiteButton name="See All" />
          </Link>
        </div>
     
        <div className="relative  overflow-x-auto overflow-y-hidden flex justify-start items-center md:h-[400px] ">
          <motion.div
            className="flex gap-2 md:gap-12"
            initial={{ opacity: 0, x: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5 },
            }}
          >
            {relatedItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                <FlashSaleItem
                  item={item}
                  index={index}
                  totalItems={relatedItems.length}
                  stars={item.stars}
                  rates={item.rates}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
     
      </> */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        vertical="top"
      >
        <Alert severity={severity} sx={{ width: "100%" }}>
          {massage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Wishlist;
