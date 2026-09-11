import { EChartsOption, SeriesOption, YAXisComponentOption } from "echarts";

export const platformUsagePieConfig: EChartsOption = {
  title: {
    text: ``,
    left: "center",
    top: "70%",
    textStyle: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
    },
  },
  series: [
    // Outer Band (Fixed 0-100%)
    {
      type: "pie",
      radius: ["92%", "95%"],
      center: ["50%", "70%"],
      startAngle: 200,
      endAngle: 340,
      data: [
        { value: 60, itemStyle: { color: "#32a82d" } },
        { value: 30, itemStyle: { color: "#d87824" } },
        { value: 10, itemStyle: { color: "#e1342e" } },
      ],
      silent: true,
      label: { show: false },
    },
    // Inner Band (Dynamic Percentage)
    {
      type: "pie",
      radius: ["70%", "89%"],
      center: ["50%", "70%"],
      startAngle: 200,
      endAngle: 340,
      data: [],
      label: { show: false },
    },
  ],
};

export const logGenerationStackConfig: EChartsOption = {
  colors: ["#444444", "#336699"], // Green for messages, Red for errors
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    axisTick: { alignWithLabel: true },
  },
  yAxis: {
    type: "value" as YAXisComponentOption["type"],
  },
  series: [
    {
      name: "Messages",
      type: "bar",
      stack: "total",
      data: null,
      itemStyle: { color: "#444444" },
      barMaxWidth: 20,
    },
    {
      name: "Error",
      type: "bar",
      stack: "total",
      data: null,
      itemStyle: { color: "#336699" },
      barMaxWidth: 20,
    },
  ],
};

export const pipelineExecutionStackConfig = {
  colors: ["#444444", "#336699"],
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    axisTick: { alignWithLabel: true },
  },
  yAxis: {
    type: "value" as YAXisComponentOption["type"],
  },
  series: [
    {
      name: "Success",
      type: "bar",
      stack: "total",
      data: [] as number[],
      itemStyle: { color: "#444444" },
      barMaxWidth: 20,
    },
    {
      name: "Failure",
      type: "bar",
      stack: "total",
      data: [] as number[],
      itemStyle: { color: "#336699" },
      barMaxWidth: 20,
    },
  ],
};

export const pipelineExecutionPie = {
  title: {
    text: "Pipeline Execution (Pie)",
    left: "center",
    textStyle: { color: "#fff", fontSize: 14 },
  },
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c} ({d}%)",
  },
  series: [
    {
      type: "pie",
      radius: "50%",
      label: { color: "#fff" },
    },
  ],
};


export const billingDetailsStackConfig: EChartsOption = {
  colors: ["#444444", "#336699"], // Grey for usage, Light Grey for over usage
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "shadow" },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    axisTick: { alignWithLabel: true },
  },
  yAxis: {
    type: "value" as YAXisComponentOption["type"],
  },
  series: [
    {
      name: "Billing Amount",
      type: "bar",
      data: null,
      itemStyle: { color: "#444444" },
      barMaxWidth: 20,
    },
    {
      name: "Paid Amount",
      type: "bar",
      data: null,
      itemStyle: { color: "#336699" },
      barMaxWidth: 20,
    },
  ],
};

export const multiLineChartConfig: Record<string, SeriesOption[]> = {
  cpu: [
    { name: "Avg CPU", type: "line", itemStyle: { borderColor: "#336699" }, smooth: true, data: [] },
    { name: "Max CPU", type: "line", itemStyle: { borderColor: "#444444" }, smooth: true, data: [] },
  ],
  memory: [
    { name: "Avg Memory", type: "line", itemStyle: { borderColor: "#336699" }, smooth: true, data: [] },
    { name: "Max Memory", type: "line", itemStyle: { borderColor: "#444444" }, smooth: true, data: [] },
  ],
  storage: [
    { name: "Avg Storage", type: "line", itemStyle: { borderColor: "#336699" }, smooth: true, data: [] },
    { name: "Max Storage", type: "line", itemStyle: { borderColor: "#444444" }, smooth: true, data: [] },
  ],
};