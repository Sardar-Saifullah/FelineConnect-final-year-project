import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Box,
  Slide,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { uploadFile } from "../../../../helpers/upload-file/upload";
import { client } from "../../../../lib/client";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../../../helpers/logic";

export const CreateEditUsersComp = ({
  data,
  edit = false,
  refetch,
  open,
  setOpen,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!username || !email || !password) {
      setError("Please fill all the fields");
      setOpenMessage(true);
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid Email");
      setOpenMessage(true);

      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      setOpenMessage(true);

      return;
    }
    if (!validateUsername(username)) {
      setError("Name must be at least 6 characters long");
      setOpenMessage(true);

      return;
    }
    try {
      setLoading(true);
      const res = await client.post(`/users/register`, {
        username,
        email,
        profileImage:
          profileImage ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        password,
      });
      refetch();
      setSuccess("user updated successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("user already exists!");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const handleEditUser = async () => {
    const userData = {};

    if (!username && !email && !profileImage && !password) {
      setError("Please fill all the fields");
      setOpenMessage(true);
      return;
    }
    if (username) {
      userData.username = username;
    }
    if (email) {
      userData.email = email;
    }
    if (profileImage) {
      userData.profileImage = profileImage;
    }
    if (password) {
      userData.password = password;
    }
    try {
      setLoading(true);
      const res = await client.put(`/users/${data?.id}`, userData);
      refetch();
      setSuccess("user updated successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid user updation error");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (edit && data) {
      setUsername("");
      setEmail("");
      setProfileImage("");
      setPassword("");

      setUsername(data?.username);
      setEmail(data?.email);
      setProfileImage(data?.profileImage);
    }
  }, [data, edit]);
  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          TransitionComponent={Slide}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            <Typography variant="h6">
              {edit ? "Edit User" : "Add User"}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Box textAlign="start" mb={4}>
              <div className="flex flex-col gap-2 w-full">
                <form
                  className="flex flex-col gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (edit) {
                      handleEditUser();
                    } else {
                      handleCreateUser();
                    }
                  }}
                >
                  <TextField
                    label="username"
                    variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <TextField
                    label="Email"
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <TextField
                    label="Password"
                    variant="standard"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {/* <div className="flex flex-col gap-1">
                    <p className="text-[13px] text-gray-700">Profile Image*</p>
                    <input
                      type="file"
                      className="w-full px-2 py-2 border-[1px] border-gray-400 rounded-[7px]"
                      onChange={async (e) => {
                        const file = e?.target?.files[0] || "";
                        if (!file) {
                          setError("Please upload the file");
                        }
                        try {
                          const fileLink = await uploadFile(file);
                          setProfileImage(fileLink);
                        } catch (e) {
                          setError("Invalid error");
                        }
                      }}
                    />
                  </div>
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt="uploaded image"
                      className="object-cover w-full"
                    />
                  )} */}

                  <Button
                    type="submit"
                    disabled={loading}
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
                    {loading ? "loading..." : "Submit"}
                  </Button>
                </form>
              </div>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openMessage}
        autoHideDuration={2000}
        onClose={() => setOpenMessage(false)}
      >
        {success ? (
          <Alert
            onClose={() => setOpenMessage(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        ) : (
          <Alert
            onClose={() => setOpenMessage(false)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
