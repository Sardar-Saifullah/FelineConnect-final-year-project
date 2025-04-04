import { Spinner } from "flowbite-react";
import { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { client } from "../lib/client";
import { AuthContext } from "../Auth/firebase";

const SuccessPayment = () => {
  const navigate = useNavigate();
  const { cartItems, resetCartItems } = useCart();
  const { currentUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const processingRef = useRef(false); // Ref to track processing

  const createOrderAndPayment = async (data, sum) => {
    if (!currentUser?.id) {
      alert("Please login before proceeding");
      return;
    }
    try {
      const res = await client.post("/orders/create", data);
      const orderId = res.data.order.id;
      const paymentData = {
        orderId,
        userId: currentUser.id,
        amount: sum,
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        transactionId: sessionId,
      };
      await client.post("/payments/create", paymentData);
      alert("Payment successful and order has been placed");
      resetCartItems();
      navigate("/allProducts");
    } catch (e) {
      console.log("Error in creating order ", e);
      alert("Error in creating order");
    }
  };

  useEffect(() => {
    if (processingRef.current) return; // Exit if already processing
    processingRef.current = true; // Mark as processing

    const shippingDetails = JSON.parse(localStorage.getItem("shippingDetails"));
    if (!sessionId || !shippingDetails || !currentUser) {
      processingRef.current = false; // Reset processing flag
      return;
    }

    const { apartment, city, phoneNo, address } = shippingDetails;
    const products = cartItems?.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      price: product.price,
    }));

    let sum = 0;
    cartItems?.forEach((product) => {
      sum += product.price * product.quantity;
    });

    const data = {
      userId: currentUser.id,
      products,
      apartment,
      city,
      phoneNo,
      address,
    };

    createOrderAndPayment(data, sum).finally(() => {
      processingRef.current = false; // Reset processing flag after completion
    });
  }, [sessionId, currentUser, cartItems, resetCartItems]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default SuccessPayment;
