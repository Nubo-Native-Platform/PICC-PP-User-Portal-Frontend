
import { useEffect, useState } from "react";
import { platformUsagePieConfig } from "../../configs/ChartConfig";
import ChartConverterService from "../../services/chartConverter";
import { ChartData } from "../../models/chartDataModel";
import { MultiPieChartDataType } from "./models/ChartDataType";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { PieSeriesOption } from "echarts";

interface chartConfigType {
  metadata?: {
    used?: number,
    total?: number,
    unit?: string
  },
  config: EChartsOption
}

const MultiPieChartCont = ({ id, data }: { id: string, data: MultiPieChartDataType }) => {
  const [chartDataConfigs, setChartDataConfigs] = useState<chartConfigType[]>();

  useEffect(() => {
    console.log(data);
    const keys = ["cpuUsagePercentage", "memUsagePercentage", "storageUsagePercentage"];
    const usedKeys = ["usedCpu", "usedMem", "usedStorage"];
    const totalKeys = ["maxCpu", "maxMem", "maxStorage"];
    const dayBasisData: any[] = [...data['24HBasisPerformence']];
    const chartData = keys.map((key, index) => {
      const pieChartData: ChartData[] = ChartConverterService.formatMultiPieData(key, dayBasisData);
      return { config: generatePieChartConfig(pieChartData), metadata: { used: dayBasisData[0][usedKeys[index]], total: dayBasisData[0][totalKeys[index]] } };
    });

    setChartDataConfigs(chartData);

  }, [data]);

  const generatePieChartConfig = (pieChartData: ChartData[]): EChartsOption => {
    const pieConfig: EChartsOption = {
      ...platformUsagePieConfig,
      title: {
        ...platformUsagePieConfig.title,
        text: `${pieChartData[0].value}%`
      },
      series: [
        {
          ...(Array.isArray(platformUsagePieConfig.series) ? platformUsagePieConfig.series[0] : {}),
        } as PieSeriesOption,
        {
          ...(Array.isArray(platformUsagePieConfig.series) ? platformUsagePieConfig.series[1] : {}), // Second series for the inner ring with dynamic data
          data: pieChartData,
        } as PieSeriesOption,
      ]
    };
    return pieConfig;
  };

  // const setConfigData = (data: ChartData[]) => {
  //   const configData = { ...platformUsagePieConfig }
  //   return {
  //     ...configData,
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     series: Array.isArray(configData?.series) ? configData.series.map((seriesItem: any, index: number) => ({
  //       ...seriesItem,
  //       data: data.map(d => { return { ...d, value: index == 0 ? 100 : d.value / 10 } }), // Dynamically inject data
  //     })) : [],
  //   }
  // }

  return (<>
    <div className="flex flex-col h-full bg-black">
      <div className="text-[var(--text-color-primary)] text-xs px-4 pt-4">Platform Memory, CPU & Storage usage with Deployed PODs</div>
      <div className="grow">
        <div className="flex justify-between space-x-1 p-4 h-full">
          {chartDataConfigs && chartDataConfigs.map(chartData =>
            <div className="flex-1 h-full">
              <div className="h-[60%] bg-[#1e1c1d]  border-2 border-[#1e1c2e] rounded-2">
                <ReactECharts option={chartData.config} style={{ width: "100%", height: "100%" }}
                  opts={{ renderer: "canvas" }} />
              </div>
              <div className="h-[20%] mt-1 flex space-x-1">
                <div className="flex-1 bg-[#1e1c1d] p-1 text-center text-xs text-[#da5b32]"><div className="text-[9px] h-1/2 text-[var(--text-color-secondary)]">Used</div>{chartData.metadata?.used}</div>
                <div className="flex-1 bg-[#1e1c1d] p-1 text-center text-xs text-[#0487d9]"><div className="text-[9px] h-1/2 text-[var(--text-color-secondary)]">Total</div>{chartData.metadata?.total}</div>
              </div>
              <div className="bg-[#1e1c1d]"></div>
            </div>
          )}
        </div></div>
    </div>

  </>
  )
}

export default MultiPieChartCont;
