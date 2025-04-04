import { ChevronLeft } from "@mui/icons-material";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { OrdersTable } from "../tables/order-table";
import { ReviewTable } from "../tables/review-table";

export const UserProfile = ({ profile, setProfile, data, refetch }) => {
  const [orders, setOrder] = useState([]);
  const [review, setReview] = useState([]);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (data) {
      setOrder(data?.Orders || []);
      setReview(data?.Reviews || []);
    }
  }, [data]);
  return (
    <main className="flex flex-col gap-4">
      <div className="min-w-[250px]">
        <Button
          onClick={() => setProfile(false)}
          className="pb-2 h-[30px] flex items-center justify-center rounded-[10px] bg-gray-100 text-gray-400 hover:bg-gray-200"
        >
          <div className="flex items-center gap-1 bg-[#DB4444] rounded-[7px] px-2 py-1">
            <ChevronLeft className="w-[17px] h-[17px] text-white" />
            <p className="text-[14px] font-[500] text-white">Back</p>
          </div>
        </Button>
      </div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.username}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <p>{data?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start gap-3 py-5">
        {["Orders", "Reviews"].map((val, index) => {
          return (
            <>
              <div
                key={index}
                onClick={() => setStep(index)}
                className={`flex items-center justify-center cursor-pointer gap-2 rounded-md transition-all text-black w-[130px] border-[1px] py-3 px-3
                ${index === step ? "bg-[#DB4444]" : "bg-white"}`}
              >
                <p
                  className={`${
                    index === step ? "text-white font-[600]" : "text-black"
                  }`}
                >
                  {val}
                </p>
              </div>
            </>
          );
        })}
      </div>
      <div>
        {step === 0 && (
          <div>
            <OrdersTable data={orders || []} refetch={refetch} />
          </div>
        )}
        {step === 1 && (
          <div>
            <ReviewTable data={review || []} />
          </div>
        )}
      </div>
    </main>
  );
};
