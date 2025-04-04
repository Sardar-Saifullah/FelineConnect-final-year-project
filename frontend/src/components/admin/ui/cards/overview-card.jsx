import { LocalActivity } from "@mui/icons-material";
import React from "react";

export const OverviewCard = ({ title, value }) => {
  return (
    <div className="flex flex-col relative items-start px-5 justify-center w-[320px] h-[100px] shadow-md border-[1px] border-gray-400/40 gap-1 rounded-[14px]">
      <p className="text-[24px] text-black/60 font-[700]">{title}</p>
      <p className="text-[24px] text-black/60 font-[600]">{value || 0}</p>
      <LocalActivity className="absolute top-[15px] right-[10px] text-[#33a457]" />
    </div>
  );
};
