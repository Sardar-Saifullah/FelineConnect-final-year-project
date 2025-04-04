import { useState, useEffect, useContext } from "react";
import { useCart } from "../context/CartContext";
import CheckoutCartItem from "../components/Checkout/CheckoutCartItem";
import RedButton from "../components/common/components/RedButton";
import ActiveLastBreadcrumb from "../components/common/components/Link";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../lib/client";
import { Alert, Snackbar } from "@mui/material";
import { AuthContext } from "../Auth/firebase";

const Checkout = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { cartItems } = useCart();
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [phoneNo, setPhoneNo] = useState("+92");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const originUrl = window.location.origin;
    if (!apartment || !city || !phoneNo || !address || !originUrl) {
      setError("Please fill all the fields");
      setOpen(true);
      return;
    }
    if (apartment?.length < 10) {
      setError("Home address must be at least 10 characters long");
      setOpen(true);
      return;
    }
    if (address?.length < 10) {
      setError("Shipping address must be at least 10 characters long");
      setOpen(true);
      return;
    }
    if (phoneNo?.length < 10) {
      setError("Phone number must be at least 10 digit long");
      setOpen(true);
      return;
    }
    let processedData = cartItems?.map((product) => {
      return {
        name: product.title,
        quantity: product.quantity,
        price: parseFloat(product.price) * 100,
      };
    });
    if (processedData?.length <= 0) {
      setError("None items has been added in the cart");
      setOpen(true);
      return;
    }
    localStorage.setItem(
      "shippingDetails",
      JSON.stringify({
        apartment,
        city,
        phoneNo,
        address,
      })
    );
    try {
      setLoading(true);
      const res = await client.post("/payments/checkout", {
        products: processedData,
        originUrl,
      });
      const url = res.data.url;
      if (url) {
        window.location.replace(url);
      } else {
        setError("Something went wrong");
        setOpen(true);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setError("Invalid error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal of all cart items
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const total = subtotal; // You can calculate total including shipping, taxes, etc.

  return (
    <div className="max-w-screen-lg mx-auto mt-36 md:mt-48 flex flex-col md:gap-10">
      <ActiveLastBreadcrumb path={`Home/Apply Coupon`} />

      <form onSubmit={handleSubmit}>
        <div className="flex items-center mt-4 md:flex-row flex-col gap-10 md:gap-40">
          <div className="flex items-center justify-between  mt-4">
            <div className="flex flex-col gap-4 md:gap-12">
              <span className="text-2xl md:text-4xl font-medium">
                Billing Details
              </span>

              <div className="flex flex-col gap-4 md:gap-8 w-[300px] md:w-[470px]">
                <div className="flex flex-col gap-1">
                  <span className="text-sm md:text-base text-gray-400">
                    Phone No *
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    required
                    value={phoneNo}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base focus:border outline-none focus:border-gray-300  "
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm md:text-base text-gray-400">
                    Home Address *
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    required
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base focus:border outline-none focus:border-gray-300  "
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm md:text-base text-gray-400">
                    Shipping Address *
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base focus:border outline-none focus:border-gray-300  "
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm md:text-base text-gray-400">
                    City *
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base focus:border outline-none focus:border-gray-300  "
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between flex-col gap-4 md:gap-8  px-4 w-full md:w-[425px]">
            {cartItems.map((item, index) => (
              <CheckoutCartItem
                key={item.title}
                item={item}
                index={index}
                stars={item.stars}
                rates={item.rates}
              />
            ))}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between  border-b">
                <p className="text-base">Sub total:</p>
                <p className="text-base">${subtotal}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between  border-b">
                <p className="text-base">Shipping:</p>
                <p className="text-base">Free</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between  border-b">
                <p className="text-base">Total:</p>
                <p className="text-base">${total}</p>
              </div>
            </div>
            {/* Payment methods */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <p className="text-base">Methods: Credit Card</p>
              </div>
            </div>

            <div className="mr-auto">
              <RedButton
                disabled={!!!currentUser}
                name={loading ? "loading..." : "Place Order"}
              />
            </div>
          </div>
        </div>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error ? error : message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Checkout;
