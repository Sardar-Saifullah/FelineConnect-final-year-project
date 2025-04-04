"use client";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Button, Snackbar, TextField, Alert, CircularProgress, IconButton } from "@mui/material"; // Import IconButton
import OTPInput from "react-otp-input";
import { client } from "../lib/client";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export const ForgetPassword = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Track which step we’re on
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(""); // Error state to handle backend messages

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    if (!loading) {
      setOpen(false); // Close modal only if not loading
      setStep(1);
      setError(""); // Clear error message on close
    }
  };

  const handleSendOtp = async () => {
    setLoading(true); // Show loader on Send OTP button
    try {
      const response = await client.post("/users/otpSend", {
        email,
      });

      // Move to the next step if OTP is successfully sent
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error);  // Log the full error object

      // Check if there's a response from the backend and show the error message
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Set the error message
      } else {
        // Generic error if no message is provided by backend
        setError("Error sending OTP. Please try again.");
      }
    } finally {
      setLoading(false); // Hide loader after response is received
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const response = await client.post("/users/resetpassword", {
        email,
        otp: parseInt(otp, 10),
        newPassword: password,
      });
      setOpen(false);
      setError(""); // Clear error on successful password change
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Failed to reset password. Please try again.");
      setStep(2); // Keep the user on the OTP verification step
    } finally {
      setLoading(false); // Hide loader after response is received
    }
  };

  return (
    <div>
      <div onClick={handleOpen}>{children}</div>
      {open && (
        <Modal
          open={open}
          onClose={handleClose} // Handle close manually
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div
            style={style}
            className="p-4 rounded-[10px] shadow-md bg-white md:w-[600px] max-md:w-full"
          >
            {/* Close button in the top right */}
            <IconButton
              onClick={handleClose}
              disabled={loading} // Disable close button while loading
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1,
              }}
            >
              <CloseIcon />
            </IconButton>

            <h1 className="text-[24px] font-[700] pb-4">Change Password</h1>
            <div className="flex flex-col gap-3 w-full">
              {step === 1 && (
                <>
                  <TextField
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button
                    loading={loading}
                    disabled={!email || loading}
                    onClick={handleSendOtp}
                    variant="contained"
                    color="primary"
                    className="mt-2"
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                  </Button>
                </>
              )}

              {step === 2 && (
                <>
                  <label>Enter the OTP sent to your email</label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputStyle={{
                      width: "100%",
                      margin: "0.5rem",
                      padding: "10px",
                      border: "1px solid black",
                      borderRadius: "10px",
                      fontSize: "20px",
                      fontWeight: 700,
                    }}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                  />
                  <Button
                    loading={loading}
                    disabled={otp.length < 6 || loading}
                    onClick={() => setStep(3)}
                    variant="contained"
                    color="primary"
                    className="mt-2"
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                  </Button>
                </>
              )}

              {step === 3 && (
                <>
                  <TextField
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    type="password"
                  />
                  <TextField
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    type="password"
                  />
                  <Button
                    loading={loading}
                    disabled={
                      password !== confirmPassword || !password || loading
                    }
                    onClick={handleChangePassword}
                    variant="contained"
                    color="primary"
                    className="mt-2"
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Change Password"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={!!error} // Show snackbar if there is an error
        autoHideDuration={2000}
        onClose={() => setError("")} // Close snackbar on close
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};
