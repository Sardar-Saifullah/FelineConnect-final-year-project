import { useState } from "react";
import {
  ChevronLeftSharp,
  ChevronRightSharp,
  MoreVert,
} from "@mui/icons-material";
import { renderPageNumbers } from "../page-pagination-counter";
import { Alert, Button, Menu, MenuItem, Snackbar } from "@mui/material";
import { CreateEditProductsComp } from "../dialogs/create-edit-product";
import { client } from "../../../../lib/client";

export const ProductTable = ({
  data,
  onPageChange,
  totalPages,
  currentPage,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openMessage, setOpenMessage] = useState(false);
  const open = Boolean(anchorEl);

  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid error");
      setOpenMessage(true);
      return;
    }

    try {
      setLoading(true);
      const res = await client.delete(`/products/${id}`);
      refetch();
      setSuccess("Product deleted successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid product updation deletion");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-row items-center justify-center h-[60vh] w-full">
        <p>No products found for this category.</p>
      </div>
    );
  }
  return (
    <>
      {openEdit && selectedItem && (
        <CreateEditProductsComp
          refetch={refetch}
          edit={true}
          data={selectedItem}
          open={openEdit}
          setOpen={setOpenEdit}
        />
      )}
      <table className="w-full">
        <thead className="bg-[#DB4444] text-white">
          <tr>
            <th className="p-3 text-start">ID</th>
            <th className="p-3 text-start">Name</th>
            <th className="p-3 text-start">Description</th>
            <th className="p-3 text-start">Price</th>
            <th className="p-3 text-start">Quantity</th>
            <th className="p-3 text-start">Rating</th>
            <th className="p-3 text-start">Edit</th>
            <th className="p-3 text-start">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((product) => (
            <tr
              key={product.id}
              className="border-t-[1px] border-b-[1px] border-gray-400/20 cursor-pointer hover:bg-gray-100"
            >
              <td className="p-3">{product.id}</td>
              <td className="p-3">{product?.title}</td>
              <td className="p-3">{product?.details}</td>
              <td className="p-3">{product?.price}</td>
              <td className="p-3">{product?.quantity}</td>
              <td className="p-3">{product?.averageRating}</td>
              <td className="p-3">
                <div
                  onClick={() => {
                    setSelectedItem(product);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </div>
              </td>
              <td className="p-3">
                <div onClick={() => handleDelete(product.id)}>Delete</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-center gap-2 my-7">
        {currentPage > 1 && (
          <div
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeftSharp className="w-5 h-5" />
          </div>
        )}

        {renderPageNumbers(totalPages, onPageChange, currentPage)}

        {currentPage < totalPages && (
          <div
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <ChevronRightSharp className="w-5 h-5" />
          </div>
        )}
      </div>
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
