import { MoreVert } from "@mui/icons-material";
import { Alert, Button, Menu, MenuItem, Snackbar } from "@mui/material";
import { useState } from "react";
import { CreateEditCategoryComp } from "../dialogs/create-edit-category";
import { client } from "../../../../lib/client";

export const CategoryTable = ({ data, edit = false, refetch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid error");
      setOpenMessage(true);
      return;
    }

    try {
      setLoading(true);
      const res = await client.delete(`/categories/delete/${id}`);
      refetch();
      setSuccess("Category deleted successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid category deletion");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-row w-full h-[60vh] items-center justify-center text-gray-400">
        <p>No Category Found.</p>
      </div>
    );
  }
  return (
    <>
      {openEdit && selectedItem && (
        <CreateEditCategoryComp
          edit={true}
          data={selectedItem}
          refetch={refetch}
          open={openEdit}
          setOpen={setOpenEdit}
        />
      )}
      <table className="w-full">
        <thead className="bg-[#DB4444] text-white">
          <tr>
            <th className="p-3 text-start">ID</th>
            <th className="p-3 text-start">Name</th>
            <th className="p-3 text-start">Edit</th>
            <th className="p-3 text-start">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((category) => (
            <tr
              key={category.name}
              className="border-t-[1px] border-b-[1px] border-gray-400/20 cursor-pointer hover:bg-gray-100"
            >
              <td className="p-3">{category?.id}</td>
              <td className="p-3">{category?.name}</td>
              <td className="p-3">
                <div
                  onClick={() => {
                    setSelectedItem(category);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </div>
              </td>
              <td className="p-3">
                <div
                  onClick={() => {
                    handleDelete(category.id);
                  }}
                >
                  Delete
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
