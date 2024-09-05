import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";

HighchartsMore(Highcharts); // Initialize highcharts-more with Highcharts

interface CountData {
  data: (number | [number, number] | null)[];
  name: string;
  type?: string;
}

interface LineChartProps {
  countData: CountData[];
}

const LineChart: React.FC<LineChartProps> = ({ countData }) => {
  const options: Highcharts.Options = {
    title: {
      text: "Expression Pattern Over Time",
      x: -20, //center
    },
    subtitle: {
      text: "",
      x: -20,
    },
    xAxis: {
      title: {
        text: "Days Post Infection",
      },
      categories: Array.from({ length: 16 }, (_, i) => i.toString()),
    },
    yAxis: {
      title: {
        text: "log2(Counts per million)",
      },
      plotLines: [
        {
          value: 0,
          width: 1,
          color: "#808080",
        },
      ],
    },
    plotOptions: {
      series: {
        connectNulls: true,
      },
    },
    tooltip: {
      valueSuffix: "",
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      borderWidth: 0,
    },
    chart: {},
    series: countData as Highcharts.SeriesOptionsType[],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineChart;
