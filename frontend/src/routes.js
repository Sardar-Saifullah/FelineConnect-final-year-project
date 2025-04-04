import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Contact from "./Pages/Contact";
import Account from "./Pages/Account";
import About from "./Pages/About";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import Product from "./Pages/Product";
import AllProducts from "./Pages/AllProducts";
import NotFound from "./Pages/NotFound";
import CancelPayment from "./Pages/CancelPayment";
import SuccessPayment from "./Pages/SuccessPayment";
import AccountStatus from "./Pages/AccountStatus";
import { Dashboard } from "./Pages/admin/dashboard";

export const noLoginRoutes = [
  {
    path: "/",
    element: Layout,
    children: [
      { path: "", element: Home },
      // { path: "account/status", element: AccountStatus },
      // { path: "account", element: Account },
      // { path: "/admin", element: Dashboard },
      { path: "contact", element: Contact },
      { path: "about", element: About },
      { path: "signup", element: SignUp },
      { path: "login", element: LogIn },
      { path: "wishlist", element: Wishlist },
      { path: "cart", element: Cart },
      { path: "checkout", element: Checkout },
      { path: "success", element: SuccessPayment },
      { path: "cancel", element: CancelPayment },
      { path: "allProducts", element: AllProducts },
      { path: "allProducts/:id", element: Product },
      { path: "*", element: NotFound },
    ],
  },
];
export const loginRoutes = [
  {
    path: "/",
    element: Layout,
    children: [
      { path: "", element: Home },
      { path: "contact", element: Contact },
      { path: "account/status", element: AccountStatus },
      { path: "account", element: Account },
      { path: "about", element: About },
      { path: "signup", element: SignUp },
      { path: "login", element: LogIn },
      { path: "wishlist", element: Wishlist },
      { path: "cart", element: Cart },
      { path: "checkout", element: Checkout },
      { path: "success", element: SuccessPayment },
      { path: "cancel", element: CancelPayment },
      { path: "allProducts", element: AllProducts },
      { path: "allProducts/:id", element: Product },
      { path: "*", element: NotFound },
    ],
  },
];
export const adminLoginRoutes = [
  {
    path: "/",
    element: Layout,
    children: [
      { path: "", element: Dashboard },
      { path: "*", element: NotFound },
    ],
  },
];
