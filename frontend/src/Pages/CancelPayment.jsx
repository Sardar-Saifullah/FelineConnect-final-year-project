import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ActiveLastBreadcrumb from "../components/common/components/Link";
import RedButton from "../components/common/components/RedButton";
import notFoundIcon from "../assets/notFound.png";
import { Fab } from "@mui/material";

const CancelPayment = () => {
  const [countdown, setCountdown] = useState(20); // Set initial countdown value

  // Function to decrement the countdown
  const decrementCountdown = () => {
    if (countdown > 0) {
      setCountdown(countdown - 1);
    }
  };

  // Automatically redirect to home page when countdown reaches 0
  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        decrementCountdown();
      } else {
        window.location.href = "/";
      }
    }, 1000); // Update countdown every second
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="flex flex-col justify-around items-start mt-36 mx-4 md:mx-40 ">
      <ActiveLastBreadcrumb path="Home/Cancel Payment" />
      <div className="flex flex-col items-center mt-12 mx-auto">
        <div className="flex flex-col justify-center gap-4 items-center text-center">
          <h1 className="text-3xl md:text-8xl">Cancelled Payment</h1>{" "}
          <h6 className="text-xs md:text-xl">
            Your payment has been cancelled or rejected. You will be redirected
            to the home page in
            <span className="mx-3">
              <Fab>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-30 hover:opacity-80"></span>
                <span className="flex justify-center items-center  bg-red-500 rounded-full w-14 h-14 text-white font-semibold">
                  {countdown}
                </span>
              </Fab>
            </span>
            seconds.
            {/* Simple countdown animation */}
            {/* <div className="countdown-animation w-12 h-12 rounded-full bg-red-500 animate-ping"></div> */}
          </h6>
        </div>

        <Link to="..">
          <RedButton name="Back to Home" />
        </Link>
      </div>
    </div>
  );
};

export default CancelPayment;
