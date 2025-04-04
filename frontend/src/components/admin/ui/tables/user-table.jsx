import {
  ChevronLeftSharp,
  ChevronRightSharp,
  MoreVert,
} from "@mui/icons-material";
import { renderPageNumbers } from "../page-pagination-counter";
import { Alert, Button, Menu, MenuItem, Snackbar } from "@mui/material";
import { CreateEditUsersComp } from "../dialogs/create-edit-user";
import { useState } from "react";
import { client } from "../../../../lib/client";

export const UserTable = ({
  data,
  onPageChange,
  totalPages,
  currentPage,
  setSelectedItem,
  profile,
  setProfile,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [openMessage, setOpenMessage] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
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
      const res = await client.delete(`/users/${id}`);
      refetch();
      setSuccess("User deleted successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid user deletion");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  if (!data || data.length === 0) {
    return <p>No User found.</p>;
  }

  return (
    <>
      {selectedUser && openEdit && (
        <CreateEditUsersComp
          refetch={refetch}
          edit={true}
          data={selectedUser}
          open={openEdit}
          setOpen={setOpenEdit}
        />
      )}
      <table className="w-full">
        <thead className="bg-[#DB4444] text-white">
          <tr>
            <th className="p-3 text-start">ID</th>
            <th className="p-3 text-start">Username</th>
            <th className="p-3 text-start">Email</th>
            <th className="p-3 text-start">Total Orders</th>
            <th className="p-3 text-start">Total Reviews</th>
            <th className="p-3 text-start">Edit</th>
            <th className="p-3 text-start">Delete</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((user) => (
            <tr
              key={user.id}
              className="border-t-[1px] border-b-[1px] border-gray-400/20 cursor-pointer hover:bg-gray-100"
            >
              <td className="p-3">{user.id}</td>
              <td
                className="p-3"
                onClick={() => {
                  setSelectedItem(user);
                  setProfile(true);
                }}
              >
                {user?.username}
              </td>
              <td className="p-3">{user?.email}</td>
              <td className="p-3">{user?.Orders?.length || 0}</td>
              <td className="p-3">{user?.Reviews?.length || 0}</td>
              <td className="p-3">
                <div
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </div>
              </td>
              <td className="p-3">
                <div onClick={() => handleDelete(user.id)}>Delete</div>
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
