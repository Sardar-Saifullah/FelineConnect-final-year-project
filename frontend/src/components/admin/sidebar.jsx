import React from "react";
import Logo from "../Header/Logo";
import { useNavigate } from "react-router-dom";

export const SidebarComp = ({ menu, page, setPage }) => {
  return (
    <div className=" bg-white/80 shadow-md h-screen overflow-auto hide-scroll flex flex-col items-center fixed px-4 py-7">
      <Logo flag={true} />
      <div className="mt-14 flex flex-col gap-3 w-full">
        {menu?.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                if (index === menu?.length - 1) {
                  localStorage?.clear();
                  window.location = "/";
                } else {
                  setPage(index);
                }
              }}
              className={`flex items-center cursor-pointer gap-2 rounded-md transition-all text-black w-full bprder-t-[1px] border-b-[1px] py-3 px-3
                ${index === page ? "bg-[#DB4444]" : "bg-white"}`}
            >
              <p
                className={`${
                  index === page ? "text-white font-[600]" : "text-black"
                }`}
              >
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
