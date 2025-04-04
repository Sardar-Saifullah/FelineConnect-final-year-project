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
  Select,
  MenuItem,
} from "@mui/material";
import { uploadFile } from "../../../../helpers/upload-file/upload";
import { useProductCategories } from "../../../../actions/query";
import { client } from "../../../../lib/client";

export const CreateEditProductsComp = ({
  // children,
  data,
  edit = false,
  refetch,
  open,
  setOpen,
}) => {
  const { data: categoryData, isLoading } = useProductCategories();
  // const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = async () => {
    if (!imageSrc || !title || !details || !price || !quantity || !categoryId) {
      setError("Please fill all the fields");
      setOpenMessage(true);
      return;
    }

    try {
      setLoading(true);
      const res = await client.post("/products/create", {
        imageSrc,
        title,
        details,
        price,
        quantity,
        categoryId,
      });
      refetch();
      setSuccess("Product created successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid product creation error");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const handleEditProduct = async () => {
    console.log("Thsi is my data ", data);
    if (
      !imageSrc ||
      !title ||
      !details ||
      !price ||
      !quantity ||
      !categoryId ||
      !data?.id
    ) {
      setError("Please fill all the fields");
      setOpenMessage(true);
      return;
    }
    const myData = {
      imageSrc,
      title,
      details,
      price,
      quantity,
      categoryId,
    };
    try {
      setLoading(true);
      const res = await client.put(`/products/${data?.id}`, {
        data: myData,
      });
      refetch();
      setSuccess("Product updated successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid product updation error");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    if (edit && data) {
      setTitle(data?.title);
      setDetails(data?.details);
      setPrice(data?.price);
      setQuantity(data?.quantity);
      setImageSrc(data?.imageSrc);
      setCategoryId(data?.categoryId);
    }
    if (categoryData && !edit) {
      setCategoryId(categoryData[0]?.id);
    }
  }, [data, edit, categoryData]);
  return (
    <>
      {/* <div onClick={handleOpen}>{children}</div> */}

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
              {edit ? "Edit Product" : "Add Product"}
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
                      handleEditProduct();
                    } else {
                      handleCreateProduct();
                    }
                  }}
                >
                  <TextField
                    label="Title"
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <TextField
                    label="Details"
                    variant="standard"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                  />
                  <TextField
                    label="Price"
                    type="number"
                    variant="standard"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <TextField
                    label="Quantity"
                    variant="standard"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />

                  <div className="flex flex-col gap-1">
                    <p className="text-[13px] text-gray-700">Product Image*</p>
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
                          setImageSrc(fileLink);
                        } catch (e) {
                          setError("Invalid error");
                        }
                      }}
                    />
                  </div>
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="uploaded image"
                      className="object-cover w-full"
                    />
                  )}
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={categoryId}
                    label="Category"
                    onChange={handleChange}
                  >
                    {categoryData?.map((val) => {
                      return (
                        <MenuItem value={val.id} key={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <div>
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
                    <Button
                      onClick={() => {
                        setOpen(false);
                      }}
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
                      Close
                    </Button>
                  </div>
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
