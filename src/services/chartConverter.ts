import { MarketplaceContributionModel } from "@/models/apimodels/marketplace-contribution-model";
import { HourlyApiGateway, hourlyPipelineExecution } from "../components/charts/models/ChartDataType";
import {
  LogGenerationChartDataType
} from "../components/charts/models/ChartDataType";
import { LineChartData, LineChartSeries } from "@/components/charts/models/chartBaseTypes";
import { EChartsOption } from "echarts";
import { ChartData } from "@/models/chartDataModel";

const ChartConverterService = {
  formatMultiPieData(field: string, data: { [key: string]: any }[]) {
    if (data && data.length > 0) {
      const pieData = data[0];
      return [
        {
          value: pieData[field] / 10,
          itemStyle: {
            color: `${pieData[field] / 10 > 90
              ? "#e1342e"
              : pieData[field] / 10 > 60
                ? "#d87824"
                : "#32a82d"
              }`,
          },
        },
        {
          value: 100 - pieData[field] / 10,
          itemStyle: { color: "#262626" },
        },
      ];
    }
    return [];
  },

  formatLogGenerationData(data: LogGenerationChartDataType[]) {

    const sortedData = [...data].sort((a, b) => {
      if (a.logDate === b.logDate) return a.hour - b.hour;
      return a.logDate > b.logDate ? 1 : -1;
    });

    const categories = sortedData.map((d) => `${d.hour}:00`);
    const messages = sortedData.map((d) => d.totMsg);
    const errors = sortedData.map((d) => d.totErr);
    return { categories, messages, errors };
  },

  formatPipelineExecutionBar(data: hourlyPipelineExecution[]) {

    const sortedData = [...data].sort((a, b) => {
      const aDate = new Date(a.plDate);
      const bDate = new Date(b.plDate);
      if (a.plDate === b.plDate) return a.hour - b.hour;
      return aDate > bDate ? 1 : -1;
    });

    const categories = sortedData.map((d) => `${d.hour}:00`);
    const success = sortedData.map((d) => d.plSuccess);
    const failure = sortedData.map((d) => d.plFail);
    return { categories, success, failure };
  },

  formatApiGatewayBar(data: HourlyApiGateway[]) {
    // Sort by logDate & hour
    const sortedData = [...data].sort((a, b) => {
      const aDate = new Date(a.apiDate);
      const bDate = new Date(b.apiDate);
      if (a.apiDate === b.apiDate) return a.hour - b.hour;
      return aDate > bDate ? 1 : -1;
    });

    const categories = sortedData.map((d) => `${d.hour}:00`);
    const success = sortedData.map((d) => d.apiSuccess);
    const failure = sortedData.map((d) => d.apiFail);
    return { categories, success, failure };
  },
};

export const marketplaceRevenueDataToLineChartData = (
  marketPlaceData: MarketplaceContributionModel,
): LineChartData => {
  // Get all unique months across all solutions
  const monthSet = new Set<string>();

  marketPlaceData.solutions.forEach((solution) => {
    solution.monthlyData.forEach((entry) => {
      monthSet.add(entry.month);
    });
  });

  const months = Array.from(monthSet).sort(
    (a, b) =>
      new Date(`${a} 1, 2000`).getTime() - new Date(`${b} 1, 2000`).getTime(),
  );

  const series: LineChartSeries[] = [];

  marketPlaceData.solutions.forEach((solution) => {
    const data = months.map((month) => {
      const match = solution.monthlyData.find((m) => m.month === month);
      return match?.revenue ?? 0;
    });

    series.push({
      name: solution.solution,
      data,
    });
  });

  return { categories: months, series };
};

export const formatPieChartData = (
  baseConfig: EChartsOption,
  data: MarketplaceContributionModel
): EChartsOption => {
  if (!data || !data.solutions || data.solutions.length === 0) return baseConfig;

  // Step 1: Aggregate total revenue per solution
  const pieData = data.solutions.map(solutionEntry => {
    const totalRevenue = solutionEntry.monthlyData.reduce(
      (sum, monthData) => sum + (monthData.revenue ?? 0),
      0
    );
    return {
      name: solutionEntry.solution,
      value: totalRevenue,
    };
  });

  // Step 2: Clone baseConfig to avoid mutation
  const pieChartConfig: EChartsOption = JSON.parse(JSON.stringify(baseConfig));

  // Step 3: Inject pieData into the config
  if (pieChartConfig.series && Array.isArray(pieChartConfig.series)) {
    pieChartConfig.series[0].data = pieData;
  }

  // Step 4: Optionally update legend data
  pieChartConfig.legend = {
    ...pieChartConfig.legend,
    data: pieData.map(item => item.name),
  };

  return pieChartConfig;
}

export default ChartConverterService;
