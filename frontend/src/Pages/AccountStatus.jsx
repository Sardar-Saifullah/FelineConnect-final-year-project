import ActiveLastBreadcrumb from "../components/common/components/Link";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { auth, AuthContext, firestore } from "../Auth/firebase";
import { useState, useEffect, useContext } from "react";
import { client } from "../lib/client";
import RedButton from "../components/common/components/RedButton";

const AccountStatus = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    if (!currentUser?.id) {
      alert("user is not logged in");
      returnl;
    }
    try {
      const res = await client.delete(`/users/${currentUser.id}`);
      setCurrentUser();
      localStorage.clear();
      navigate("/");
    } catch (e) {
      console.log(e);
      alert("invalid error");
    }
  };
  return (
    <div className="flex flex-col mx-4 md:ml-36 mt-48 gap-20 justify-center md:justify-between ">
      <div className="flex justify-between   flex-col gap-4 md:flex-row ">
        <ActiveLastBreadcrumb path={`Home/My Account`} />
      </div>
      <div className="flex flex-col md:flex-row gap-28">
        <nav className="flex flex-col gap-4 text-gray-400">
          <h1 className="text-black text-sm md:text-base  font-medium">
            Manage My Account
          </h1>
          <ul>
            <li className="px-4 py-2">
              <Link
                to="/account"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
                My Profile
              </Link>
            </li>
            <li className="px-4 py-2">
              <Link
                to="/account/status"
                className="hover:underline hover:underline-offset-8 ease-in-out duration-300 transform  focus:text-red-600"
              >
                Account Status
              </Link>
            </li>
          </ul>
        </nav>
        <div className="shadow  w-[full] flex flex-col py-10 md:px-20 px-5 rounded">
          <div className="flex flex-col gap-6 md:w-[710px]">
            <span className="text-xl font-medium text-red-600">
              Account Status
            </span>
            <div className="pt-10 flex flex-col gap-2 items-center justify-center w-full">
              <div onClick={handleDelete}>
                <RedButton name="Delete this account" />
              </div>
              <p className="text-gray-400 text-[12px] text-center">
                By pressing this button account will
                <br /> be permanent deleted
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Snackbar for displaying success or error messages */}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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

export default AccountStatus;
