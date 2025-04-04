import { useState } from "react";
import { ViewProductsComp } from "../dialogs/view-products";
import { Alert, Snackbar } from "@mui/material";
import { client } from "../../../../lib/client";
const orderStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];
export const OrdersTable = ({ data, refetch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openMessage, setOpenMessage] = useState(false);
  const onStatusChange = async (id, newStatus) => {
    if (!id || !newStatus) {
      setError("Please fill all the fields");
      setOpenMessage(true);
      return;
    }

    try {
      setLoading(true);
      const res = await client.post(`/orders/update`, {
        orderId: id,
        status: newStatus,
      });
      refetch();
      setSuccess("order updated successfully!");
      setOpenMessage(true);
      setOpen(false);
    } catch (error) {
      setError("Invalid order updation error");
      setOpenMessage(true);
    } finally {
      setLoading(false);
    }
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-row w-full h-[60vh] items-center justify-center text-gray-400">
        <p>No products found for this category.</p>
      </div>
    );
  }
  return (
    <>
      <table className="w-full">
        <thead className="bg-[#DB4444] text-white">
          <tr>
            <th className="p-3 text-start">ID</th>
            <th className="p-3 text-start">Quantity</th>
            <th className="p-3 text-start">Total Price</th>
            <th className="p-3 text-start">Status</th>
            <th className="p-3 text-start">Address</th>
            <th className="p-3 text-start">Phone No</th>
            <th className="p-3 text-start">Total Items</th>
            <th className="p-3 text-start">View Items</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((order) => (
            <tr
              key={order.id}
              className="border-t-[1px] border-b-[1px] border-gray-400/20 cursor-pointer hover:bg-gray-100"
            >
              <td className="p-3">{order?.id}</td>
              <td className="p-3">{order?.quantity}</td>
              <td className="p-3">{order?.totalPrice}</td>
              {/* <td className="p-3">{order?.status}</td> */}
              <td className="p-3">
                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="border rounded p-1"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                <div className="flex flex-col gap-1">
                  <p>{order?.apartment}</p>
                  <p>{order?.address}</p>
                  <p>{order?.city}</p>
                </div>
              </td>
              <td className="p-3">{order?.phoneNo}</td>
              <td className="p-3">{order?.OrderItems?.length}</td>
              <td className="p-3">
                <p
                  className="underline"
                  onClick={(e) => {
                    e?.stopPropagation();
                  }}
                >
                  <ViewProductsComp order={order.OrderItems || []}>
                    <div>View Items</div>
                  </ViewProductsComp>
                </p>
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
