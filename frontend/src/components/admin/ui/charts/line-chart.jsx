import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export const LineChartComp = ({ width, height, labels, data }) => {
  return (
    <LineChart
      xAxis={[
        {
          data: labels,
        },
      ]}
      series={[
        {
          data: data,
          showMark: false,
          curve: "natural",
        },
      ]}
      width={width}
      height={height}
    />
  );
};
