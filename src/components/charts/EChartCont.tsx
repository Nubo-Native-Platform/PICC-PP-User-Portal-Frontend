// EChartCont.tsx
import React from "react";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { ChartData } from "../../models/chartDataModel";

// Define the props type for EChartCont component
interface EChartContProps {
    config: EChartsOption;  // Configuration for the chart
    data: ChartData[][];    // Data to be injected into the chart
}

const EChartCont: React.FC<EChartContProps> = ({ config, data }) => {
    // Ensure we update only the data in the series part of the config

    const mergedConfig = {
        ...config,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        series: Array.isArray(config?.series) ? config.series.map((seriesItem: any, index: number) => ({
            ...seriesItem,
            data: data[0], // Dynamically inject data
        })) : [],
    };

    return (
        <div style={{ width: "100%", height: "300px" }}>
            <ReactECharts option={mergedConfig} />
        </div>
    );
};

export default EChartCont;
