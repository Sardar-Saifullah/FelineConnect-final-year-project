import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { noLoginRoutes, loginRoutes, adminLoginRoutes } from "./routes";
import Loading from "./components/common/components/Loading";
import ScrollToTop from "./components/common/components/ScrollToTop";
import QueryProvider from "./lib/query-provider";
import { AuthContext } from "./Auth/firebase";
function App() {
  const { currentUser } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log("This is my data ", currentUser);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData(); // Call the function to start data loading
  }, []);

  return (
    <Router>
      <div dir="ltr" className="font-poppins">
        <QueryProvider>
          <CartProvider>
            <WishlistProvider>
              {isLoaded ? (
                <React.Fragment>
                  <Routes>
                    {(currentUser
                      ? currentUser?.role === "admin"
                        ? adminLoginRoutes
                        : loginRoutes
                      : noLoginRoutes
                    ).map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        element={<route.element />}
                      >
                        {route.children &&
                          route.children.map((childRoute, childIndex) => (
                            <Route
                              key={childIndex}
                              path={childRoute.path}
                              element={<childRoute.element />}
                            />
                          ))}
                      </Route>
                    ))}
                  </Routes>
                  <ScrollToTop />
                </React.Fragment>
              ) : (
                <Loading />
              )}
            </WishlistProvider>
          </CartProvider>
        </QueryProvider>
      </div>
    </Router>
  );
}

export default App;
