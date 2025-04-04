import ActiveLastBreadcrumb from "../components/common/components/Link";
import { Link } from "react-router-dom";
import { Snackbar, TextField } from "@mui/material";
import { Alert } from "@mui/material";
import { auth, AuthContext, firestore } from "../Auth/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useState, useEffect, useContext } from "react";
import { client } from "../lib/client";
import { uploadFile } from "../helpers/upload-file/upload";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Account = () => {
  const { currentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser?.username || "");
      setEmail(currentUser?.email || "");
    }
  }, [currentUser]);

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      setError("Password not matching!");
      setOpen(true);
      return;
    }
    try {
      setLoading(true);
      const res = await client.put(`/users/${currentUser?.id}`, {
        username,
        email,
        password: confirmPassword,
        profileImage: profileImage || undefined,
      });
      setError("");
      setMessage("Account details updated successfully!");
      setOpen(true);
    } catch (error) {
      setError("Invalid error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col mx-4 md:ml-36 mt-48 gap-20 justify-center md:justify-between ">
      <div className="flex justify-between   flex-col gap-4 md:flex-row ">
        <ActiveLastBreadcrumb path={`Home/My Account`} />
        <h1 className="text-sm md:mr-44">
          Welcome
          <span className="text-red-600">{username}</span>
        </h1>
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
              Edit Your Profile
            </span>
            <div className="flex flex-col md:flex-row gap-6 md:gap-[50px] justify-between">
              <div className="flex flex-col gap-2 w-full">
                <span className="text-sm md:text-base "> Username</span>
                <input
                  type="text"
                  placeholder={username ? username : "your username"}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <span className="text-sm md:text-base ">Email</span>
                <input
                  type="email"
                  placeholder={email ? email : "your email"}
                  // required
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <span className="text-sm md:text-base ">Password Changes</span>
              <div className="relative flex items-center w-full">
                <input
                  type={show ? "password" : "text"}
                  placeholder="New Password"
                  label="Password"
                  variant="standard"
                  className=" rounded bg-gray-100 w-full bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {show && (
                  <div className="absolute right-[10px]">
                    <VisibilityOff
                      className=" w-4 h-4 text-gray-400 cursor-pointer z-10"
                      onClick={() => {
                        setShow(!show);
                      }}
                    />
                  </div>
                )}
                {!show && (
                  <div className="absolute right-[10px]">
                    <Visibility
                      className=" w-4 h-4 text-gray-400 cursor-pointer z-10"
                      onClick={() => {
                        setShow(!show);
                      }}
                    />
                  </div>
                )}
              </div>
              <input
                type={show ? "password" : "text"}
                placeholder="Confirm Password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className=" rounded bg-gray-100 bg-opacity-100 px-4 py-3 text-gray-400 text-sm md:text-base  focus:border outline-none focus:border-gray-300  "
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[13px] text-gray-700">Profile picture*</p>
              <input
                type="file"
                className="w-full px-2 py-2 border-[1px] border-gray-400 rounded-[7px]"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  try {
                    const fileLink = await uploadFile(file);
                    setProfileImage(fileLink);
                  } catch (e) {
                    setError("Invalid error");
                  }
                }}
              />
            </div>
            <div className="ml-auto flex items-center gap-8 text-sm md:text-base ">
              {/* Cancel and save changes buttons */}
              <button
                onClick={() => {
                  setUsername("");
                  setEmail("");

                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="hover:underline underline-offset-4  ease-in-out  duration-300 transform hover:-translate-y-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="text-sm md:text-lg bg-red-600 text-white px-6 md:px-12 py-3 rounded hover:bg-red-500 transition-transform duration-100 transform hover:translate-y-[-4px] focus:translate-y-0"
              >
                {loading ? "loading..." : "Save"}
              </button>
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

export default Account;
