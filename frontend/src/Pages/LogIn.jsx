import { useContext, useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { TextField } from "@mui/material";
import { Button, Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import SignImg from "./SignImg.png";
import { client } from "../lib/client";
import { AuthContext } from "../Auth/firebase";
import { validateEmail, validatePassword } from "../helpers/logic";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ForgetPassword } from "./ForgotPassword"; // Import the ForgetPassword

const LogIn = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
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
    try {
      if (email === "admin@gmail.com" && password === "admin123") {
        const user = {
          username: "admin",
          email,
          password,
          role: "admin",
          id: 1,
          token: "admin",
        };
        setCurrentUser(user);
        router("/");
        localStorage.setItem("cats-store-user", JSON.stringify(user));
        setMessage("Login successful!");
        setError("");
        setOpen(true);
        setEmail("");
        setPassword("");
      } else {
        const res = await client.post("/users/login", {
          email,
          password,
        });
        const user = res.data;
        localStorage.setItem("cats-store-user", JSON.stringify(user));
        setCurrentUser(user);
        setMessage("Login successful!");
        setError("");
        setOpen(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      setError("Invalid email or password");
      setOpen(true);
    }
  };

  return (
    <div className="relative flex max-lg:flex-col-reverse justify-center  md:justify-start items-center mb-36 gap-12 lg:mt-28 xl:gap-24 ">
      <img src={SignImg} alt="Sign Image" />
      <div className="flex flex-col gap-6 md:gap-8 md:mx-10 items-center sm:items-start max-lg:mt-40 justify-center">
        <h1 className="text-xl md:text-4xl font-medium font-inter ">
          Log in to Cat's
        </h1>
        <p>Enter your details below:</p>
        <form
          className="flex flex-col gap-6 md:gap-8 w-72 md:w-96"
          onSubmit={handleLogIn}
        >
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
          <div className="flex items-center gap-2 justify-between mt-4">
            <Button
              type="submit"
              sx={{
                color: "white",
                fontSize: "16px",
                bgcolor: "hsla(0, 68%, 56%, 1)",
                textTransform: "none",
                padding: "16px 0",
                borderRadius: "4px",
                fontWeight: "500",
                width: "40%",
                ":hover": {
                  bgcolor: "hsla(0, 68%, 56%, .9)",
                },
              }}
              variant="contained"
              color="primary"
              className="my-2"
            >
              Log In
            </Button>
            {/* <button
              type="button"
              className="text-base text-red-500 hover:underline font-medium "
            >
              Forgot Password?
            </button> */}
          </div>
        </form>
        <p className="text-gray-600 mx-auto">
          <span>Don't have an account?</span>
          <Link
            to="/signUp"
            className="ml-2 text-gray font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
        <p className="text-gray-600 mx-auto">
          <ForgetPassword>
            <span className="text-blue-500 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </ForgetPassword>
        </p>
      </div>
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

export default LogIn;
