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

import { client } from "../../../../lib/client";

export const CreateEditCategoryComp = ({
  data,
  edit = false,
  refetch,
  open,
  setOpen,
}) => {
  console.log("This is data ", data);
  // const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateCategory = async () => {
    if (!name) {
      setError("Please fill all the fields");
      setOpenMessage(true);
      return;
    }

    try {
      setLoading(true);
      const res = await client.post("/categories/create", {
        name,
      });
      refetch();
      setSuccess("Category created successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid category creation error");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const handleEditCategory = async () => {
    if (!name) {
      setError("Please fill all the fields");
      setOpenMessage(true);
      return;
    }

    try {
      setLoading(true);
      const res = await client.put(`/categories/update/${data.id}`, {
        name,
      });
      refetch();
      setSuccess("Category updated successfully!");
      setOpenMessage(true);

      setOpen(false);
    } catch (error) {
      setError("Invalid category updation error");
      setOpenMessage(true);
    } finally {
      setLoading(false);
      s;
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (edit && data) {
      setName("");
      setName(data?.name);
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
              {edit ? "Edit Category" : "Add Category"}
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
                      handleEditCategory();
                    } else {
                      handleCreateCategory();
                    }
                  }}
                >
                  <TextField
                    label="Name"
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

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
