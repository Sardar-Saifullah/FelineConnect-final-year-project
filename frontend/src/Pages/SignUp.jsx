import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import SignImg from "./SignImg.png";
import { uploadFile } from "../helpers/upload-file/upload";
import { client } from "../lib/client";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../helpers/logic";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const SignUp = () => {
  const router = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setError("Please fill all the fields");
      setOpen(true);

      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid Email");
      setOpen(true);

      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      setOpen(true);

      return;
    }
    if (!validateUsername(name)) {
      setError("Name must be at least 6 characters long");
      setOpen(true);

      return;
    }
    try {
      const res = await client.post("/users/register", {
        username: name,
        email,
        password,
        profileImage:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      });
      router("/login");
      setSuccess("Account created successfully!");
      setOpen(true);
    } catch (error) {
      setError("The email address is already in use.");
      setOpen(true);
    }
  };

  return (
    <div className="relative flex max-lg:flex-col-reverse justify-center  md:justify-start items-center mb-36 gap-12 lg:mt-28 xl:gap-24 ">
      <img src={SignImg} alt="Sign Image" />
      <div className="flex flex-col gap-6 md:gap-8 md:mx-10 items-center sm:items-start max-lg:mt-40 justify-center">
        <h1 className="text-4xl font-medium font-inter ">Create an account</h1>
        <p>Enter your details below:</p>
        <form
          className="flex flex-col gap-6 w-72 md:w-96"
          onSubmit={handleSignUp}
        >
          <TextField
            label="Name"
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative flex items-end">
            <TextField
              type={show ? "text" : "password"}
              label="Password"
              variant="standard"
              className="relative w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          {/* <div className="flex flex-col gap-1">
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
          </div> */}
          <Button
            type="submit"
            sx={{
              color: "white",
              fontSize: "16px",
              bgcolor: "hsla(0, 68%, 56%, .9)",
              textTransform: "none",
              padding: "16px 0",
              borderRadius: "4px",
              fontWeight: "500",
              width: "100%",
              marginTop: "1rem",
              ":hover": {
                bgcolor: "hsla(0, 68%, 56%, 1)",
                fontWeight: "500",
              },
            }}
            variant="contained"
            color="primary"
            className="my-2"
          >
            Create Account
          </Button>
        </form>

        <p className="text-gray-600 mx-auto">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 text-gray font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        {success ? (
          <Alert
            onClose={() => setOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        ) : (
          <Alert
            onClose={() => setOpen(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};
export default SignUp;
