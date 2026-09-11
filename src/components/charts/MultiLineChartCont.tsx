import React, { useEffect, useState } from 'react'
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { PortalStatistics } from './models/ChartDataType';
import { baseLineChartConfig } from '@/configs/chartBaseConfig';
import { generateChartData } from '@/services/helper';
import { portalStatsToLineChartData } from '@/services/ModelTranslator.service';

const MultiLineChartCont = ({ id, data }: { id: string, data: PortalStatistics[] }) => {

    const [chartDataConfigs, setChartDataConfigs] = useState<EChartsOption[]>();
    const textSize = getComputedStyle(document.documentElement).getPropertyValue('--font-size-sm').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color-tertiary').trim();
    const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--base-color-primary').trim();

    useEffect(() => {
        if (data && data.length > 0) {
            configureChartdata();
        }
    }, [data]);

    const configureChartdata = () => {
        const { categories, cpuSeriesData, memSeriesData, storageSeriesData } = portalStatsToLineChartData(data);
        const cpuConfig = generateChartData({
            ...baseLineChartConfig,
            title: { text: "CPU Usage (Milicore)", left: "center", textStyle: { color: textColor, fontSize: textSize, fontWeight: 500 } },
        }, categories, cpuSeriesData, "line");
        const memConfig = generateChartData({
            ...baseLineChartConfig,
            title: { text: "Memory Usage (KB)", left: "center", textStyle: { color: textColor, fontSize: textSize, fontWeight: 500 } },
        }, categories, memSeriesData, "line");
        const storageConfig = generateChartData({
            ...baseLineChartConfig,
            title: { text: "Storage Usage (MB)", left: "center", textStyle: { color: textColor, fontSize: textSize, fontWeight: 500 } },
        }, categories, storageSeriesData, "line");
        const chartData = [cpuConfig, memConfig, storageConfig];
        setChartDataConfigs(chartData);
    }

    return (
        <>
            <div className="flex flex-col h-full bg-[--base-color-primary]">
                <div className="text-xs px-4 pt-4">Platform Memory, CPU & Storage usage by Deployed PODs</div>
                <div className="grow">
                    {chartDataConfigs && chartDataConfigs.map(config =>
                        // <div className="h-[50vh]">
                        <div className="h-[50vh]">
                            <ReactECharts option={config} style={{ width: "100%", height: "100%" }}
                                opts={{ renderer: "canvas" }} />
                        </div>
                        // </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default MultiLineChartCont;
