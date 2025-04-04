import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import axios from "axios";

export function PredictionDialog({ children }) {
  const [open, setOpen] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await delay(3000);
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const temp = response.data.predicted_breed;
      setPrediction(temp);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <div onClick={handleClickOpen} className="cursor-pointer">
        {children}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="min-h-[300px] md:min-w-[500px] max-md:w-full p-4">
          <div className="pb-4 pt-2 text-[24px] font-[600]">
            Cat Breed Prediction
          </div>
          <div
            className="w-full h-[200px] border-[1px] border-gray-400 rounded-[14px]
          flex items-center justify-center
          "
          >
            {!file ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-image text-gray-400 w-14 h-14"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            ) : (
              <img
                src={file ? URL.createObjectURL(file) : ""}
                width="full"
                height="full"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <input
            type="file"
            onChange={(e) => {
              e.preventDefault();
              setFile(e.target.files[0]);
            }}
            className="p-3"
          />
          {prediction && (
            <div className="flex flex-col gap-1">
              <p className="text-[12px] text-gray-400">
                We got a prediction for you
              </p>
              <input
                type="text"
                className="border-[1px] w-full max-md:w-full border-gray-400/40 shadow-md rounded-[7px] px-4 py-2 text-black/70 text-[19px] font-[500]"
                placeholder="Prediction"
                value={prediction}
                disabled={true}
              />
            </div>
          )}
          <div className="mt-3">
            <button
              onClick={handleSubmit}
              type="button"
              disabled={loading}
              className="text-center rounded-md px-5 py-3 mt-8 shadow hover:shadow-md active:shadow-inner transition
            hover:bg-gray-50 border text-[#696A75] hover:text-[#696A75] border-[#696A75] hover:border-[#696A75]
            hover:scale-105 hover:-translate-y-2 transform  duration-300 ease-in-out"
            >
              {loading ? "loading..." : "Submit"}
            </button>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
