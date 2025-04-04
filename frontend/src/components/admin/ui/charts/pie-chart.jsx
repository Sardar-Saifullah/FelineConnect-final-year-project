import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
export function PieChartComp({ width, height, data }) {
  return (
    <div>
      <PieChart
        colors={["#DB4444", "#FFA07A", "#3BAFAF"]}
        series={[
          {
            data: data,
          },
        ]}
        width={width}
        height={height}
      />
    </div>
  );
}
