// Layout.js
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TopHeader from "../components/TopHeader/TopHeader";
import { useContext } from "react";
import { AuthContext } from "../Auth/firebase";

const Layout = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <>
      {currentUser ? (
        currentUser?.role === "user" ? (
          <>
            <TopHeader />
            <Header />
            <Outlet />
            <Footer />
          </>
        ) : (
          <>
            <Outlet />
          </>
        )
      ) : (
        <>
          <TopHeader />
          <Header />
          <Outlet />
          <Footer />
        </>
      )}
    </>
  );
};

export default Layout;
