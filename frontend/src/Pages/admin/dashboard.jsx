import React, { useState } from "react";
import { SidebarComp } from "../../components/admin/sidebar";
import { ProductManage } from "./product-manage";
import { UserManage } from "./user-manage";
import { CategoryManage } from "./categories-manage";
import { StatisticDashboard } from "./statistic-dashboard";
const sidebarItems = [
  {
    name: "Dashboard",
  },
  {
    name: "Users",
  },
  {
    name: "Categories",
  },
  {
    name: "Products",
  },

  {
    name: "Logout",
  },
];
export const Dashboard = () => {
  const [page, setPage] = useState(0);
  return (
    <>
      <main className="flex flex-row items-start">
        <aside>
          <SidebarComp menu={sidebarItems} page={page} setPage={setPage} />
        </aside>
        <section className="flex flex-col gap-3 w-full ms-[270px] h-screen overflow-auto">
          <nav className="flex items-center justify-end px-5 py-4 border-b-[1px] border-b-gray-400/40">
            <img
              src="https://st4.depositphotos.com/4329009/19956/v/450/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg"
              width={60}
              height={60}
              alt="profile"
              className="object-cover rounded-full"
            />
          </nav>

          <main className="me-4">
            {page === 0 && <StatisticDashboard />}
            {page === 1 && <UserManage />}
            {page === 2 && <CategoryManage />}
            {page === 3 && <ProductManage />}
          </main>
        </section>
      </main>
    </>
  );
};
