import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Box,
  Slide,
} from "@mui/material";

export const ViewProductsComp = ({ children, order }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white rounded-full p-2 transition duration-300"
        onClick={handleOpen}
      >
        {children}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Slide}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6">View Ordered Items</Typography>
        </DialogTitle>

        <DialogContent>
          <Box textAlign="center" mb={4}>
            <div className="space-y-3">
              {order?.map((product) => (
                <div key={product.id} className="border-b pb-4 mb-4">
                  {/* Product Name and Price */}
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-gray-600">
                      Product Name:
                    </div>
                    <div className="text-gray-700 max-w-[300px] text-end">
                      {product.Product.title}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600">Price:</span>
                    <span className="text-gray-700 text-end">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity and Product ID (from productIds) */}
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold text-gray-600">
                      Quantity:
                    </span>
                    <span className="text-gray-700 text-end">
                      {product.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
