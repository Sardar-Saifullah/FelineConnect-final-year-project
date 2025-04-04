import React from "react";
import { OverviewCard } from "../../components/admin/ui/cards/overview-card";
import { useStatisticData } from "../../actions/query";
import { PieChartComp } from "../../components/admin/ui/charts/pie-chart";
import { LineChartComp } from "../../components/admin/ui/charts/line-chart";

export const StatisticDashboard = () => {
  const { data, isLoading } = useStatisticData();
  console.log("This is frontend data ", data);
  if (isLoading) {
    return (
      <div className="h-[60vh] w-full flex flex-row items-center justify-center">
        <p>loading...</p>
      </div>
    );
  }
  return (
    <main>
      <section className="flex items-center flex-wrap gap-7">
        {[
          { title: "Total Users", value: data?.overview?.totalUsers || 0 },
          {
            title: "Total Categories",
            value: data?.overview?.totalCategories || 0,
          },
          {
            title: "Total Products",
            value: data?.overview?.totalProducts || 0,
          },
          { title: "Total Orders", value: data?.overview?.totalOrders || 0 },
          {
            title: "Total Payments",
            value: data?.overview?.totalPayments || 0,
          },
          {
            title: "Total Product Rating",
            value: data?.overview?.totalProductRatings || 0,
          },
        ]?.map((val) => {
          return <OverviewCard title={val.title} value={val.value} />;
        })}
      </section>
      <section className="flex items-center justify-start flex-wrap gap-5 my-10 bg-white px-7 py-5 border-[1px] border-gray-400/40 rounded-[14px]">
        <div className="flex flex-col gap-2">
          <h1 className="font-[700] text-[21px] text-black/70">
            Top Sold Categories
          </h1>
          <PieChartComp
            width={500}
            height={200}
            data={data?.pieCharts?.categories || []}
          />
        </div>
        {/* <div className="flex flex-col gap-2">
          <h1 className="font-[700] text-[21px] text-black/70">Payments</h1>
          <PieChartComp
            width={500}
            height={200}
            data={data?.pieCharts?.payments?.data || []}
          />
        </div> */}
      </section>
      <section className="flex items-center justify-start flex-wrap gap-5 my-10 bg-white px-7 py-5 border-[1px] border-gray-400/40 rounded-[14px]">
        <div className="flex flex-col gap-2">
          <h1 className="font-[700] text-[21px] text-black/70">Payments</h1>
          <LineChartComp
            width={350}
            height={200}
            data={data?.lineCharts?.payments?.data || []}
            labels={[1, 2, 3, 4, 5, 6, 7]}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-[700] text-[21px] text-black/70">Sales</h1>
          <LineChartComp
            width={350}
            height={200}
            data={data?.lineCharts?.sales?.data || []}
            labels={[1, 2, 3, 4, 5, 6, 7]}
          />
        </div>
      </section>
    </main>
  );
};
