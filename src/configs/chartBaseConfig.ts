import { EChartsOption } from "echarts";

export const chartColors = ["#444444", "#336699", "#88D443", "#EB3324"];

export const baseLineChartConfig: EChartsOption = {
    tooltip: {
        trigger: "axis",
    },
    legend: {
        top: "bottom",
        left: "right",
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
            fontSize: 12
        },
        show: false
    },
    grid: {
        left: "3%",
        right: "4%",
        bottom: "60",
        containLabel: true,
    },
    xAxis: {
        type: "category",
        data: [], // Will be set dynamically
        axisTick: {
            alignWithLabel: true,
        },
    },
    yAxis: {
        type: "value",
    },
    type: "line",
    series: [], // Will be injected dynamically
};

export const basePieChartConfig: EChartsOption = {
    title: {
        left: 'center',
        top: 20,
        textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
    },
    legend: {
        show: false,
    },
    series: [
        {

            type: 'pie',
            avoidLabelOverlap: true,
            padAngle: 5,
            itemStyle: {
                borderRadius: 4
            },
            radius: ['20%', '80%'],
            center: ['50%', '50%'],
            label: {
                show: true,
                position: 'inside',
                formatter: '{b}\n{d}%',
                fontSize: 12,
                overflow: 'truncate',
                color: '#000',
            },
            labelLine: {
                show: false
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

export const baseBarChartConfig: EChartsOption = {
    title: {
        left: "center",
        top: 20,
        textStyle: {
            fontSize: 16,
            fontWeight: "bold"
        }
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        }
    },
    legend: {
        bottom: 0
    },
    grid: {
        left: "3%",
        right: "4%",
        bottom: "8%",
        containLabel: true
    },
    xAxis: {
        type: "category",
        data: [],
        axisTick: { alignWithLabel: true },
        axisLabel: { rotate: 30 }
    },
    yAxis: {
        type: "value",
        name: "Count",
        splitLine: { show: true }
    },
    series: [
        {
            type: "bar",
            data: [],
            barMaxWidth: 40
        }
    ]
};

export const issueTimeBarChartConfig: EChartsOption = {
    title: {
        left: "center",
        top: 20,
        textStyle: {
            fontSize: 16,
            fontWeight: "bold"
        }
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        },
        valueFormatter: (value: number) => `${value} hr`
    },
    legend: {
        bottom: 0
    },
    grid: {
        left: "4%",
        right: "4%",
        bottom: "8%",
        containLabel: true
    },
    xAxis: {
        type: "category",
        data: [],
        axisTick: { alignWithLabel: true },
        axisLabel: { rotate: 30 }
    },
    yAxis: {
        type: "value",
        name: "Time (in hours)",
        splitLine: { show: true }
    },
    series: [
        {
            type: "bar",
            data: [],
            barMaxWidth: 40
        }
    ]
};