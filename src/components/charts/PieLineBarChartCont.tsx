import { useEffect, useState } from "react";
import { hourlyPipelineExecution } from "./models/ChartDataType";
import { TooltipComponentOption } from "echarts";
import ChartConverterService from "../../services/chartConverter";
import { pipelineExecutionStackConfig } from "../../configs/ChartConfig";
import ReactECharts, { EChartsOption } from "echarts-for-react";

interface PieLineBarChartContProps {
  '24hBasisPerformence': any[];
  'hourBasisPerformnece': hourlyPipelineExecution[];
}
const PieLineBarChartCont = ({ id, data }: { id: string, data: hourlyPipelineExecution[] }) => {
  const [chartConfigs, setChartConfig] = useState<EChartsOption>();

  useEffect(() => {
    const { categories, success, failure } = ChartConverterService.formatPipelineExecutionBar(data);
    setConfigData([categories, success, failure]);
  }, [data]);

  const setConfigData = (formattedData: [string[], number[], number[]]) => {
    const [categories, success, failure] = formattedData;

    const tooltipConfig: Partial<TooltipComponentOption> = {
      trigger: "axis", // ✅ Ensures correct type
      axisPointer: {
        type: "shadow", // ✅ Ensures correct type (line, shadow, cross, or none)
      },
    };

    const configData: EChartsOption = {
      ...pipelineExecutionStackConfig,
      xAxis: {
        type: "category",
        data: categories,
        axisTick: { alignWithLabel: true },
      },
      tooltip: tooltipConfig, // ✅ Explicitly cast tooltip
      series: Array.isArray(pipelineExecutionStackConfig.series)
        ? pipelineExecutionStackConfig.series.map((seriesItem, index) => ({
          ...seriesItem,
          data: index === 0 ? success : failure,
        })) as EChartsOption["series"]
        : [],
    };

    setChartConfig(configData);
  };

  return (
    <>
      <div className="flex flex-col h-[50vh]">
        <div className="text-[var(--text-color-primary)] text-xs px-4 pt-4">Pipeline Executions Hourly Basis</div>
        <div className="grow">
          <div className="flex justify-between space-x-4 p-4 h-full">
            {chartConfigs && (
              <div className="flex-1 h-full">
                <ReactECharts option={chartConfigs} style={{ width: "100%", height: "100%" }}
                  opts={{ renderer: "canvas" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}

export default PieLineBarChartCont;
