import { marketPlaceTableConfig } from "@/configs/TableConfig";
import { MarketplaceContributionModel } from "@/models/apimodels/marketplace-contribution-model";
import { customTableConfig, CustomTableModel } from "@/models/customTableModel";
import { marketPlaceContributionToTableModel } from "@/services/ModelTranslator.service";
import NNPGrid from "@/sharedComponents/Datagrid";
import { useEffect, useState } from "react";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { generateChartData } from "@/services/helper";
import { baseLineChartConfig, basePieChartConfig } from "@/configs/chartBaseConfig";
import { formatPieChartData, marketplaceRevenueDataToLineChartData } from "@/services/chartConverter";

const MarketplaceContributionComponent = ({ id, data }: { id: string, data: MarketplaceContributionModel }) => {
    const [tableViewData, setTableviewData] = useState<CustomTableModel | null>(null);
    const [tableConfig, setTableConfig] = useState<customTableConfig>({});
    const [lineChartConfig, setLineChartConfig] = useState<EChartsOption>();
    const [pieChartConfig, setPieChartConfig] = useState<EChartsOption>();

    useEffect(() => {
        if (data) {
            configureTableData(data);
            configureLineChartData(data);
            configurePieChartData(data);
        }
    }, [data]);

    const configureTableData = (data: MarketplaceContributionModel) => {
        const tableData = marketPlaceContributionToTableModel(data);
        const extraTableData = {
            groupByField: marketPlaceTableConfig.groupByField,
            typeField: marketPlaceTableConfig.typeField,
            isGrouped: marketPlaceTableConfig.groupByRows
        };
        setTableConfig(extraTableData);
        setTableviewData(tableData);
    }

    const configureLineChartData = (data: MarketplaceContributionModel) => {
        const { categories, series } = marketplaceRevenueDataToLineChartData(data);
        const lineChartConfigData: EChartsOption = generateChartData(baseLineChartConfig, categories, series, 'line');
        setLineChartConfig(lineChartConfigData);
    }

    const configurePieChartData = (data: MarketplaceContributionModel) => {
        const pieChartConfigData: EChartsOption = formatPieChartData(basePieChartConfig, data);
        setPieChartConfig(pieChartConfigData);
    }


    return (
        <div className="page-padding-medium">
            {/* <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">Your contributions in the Marketplace</div>
            <div className="w-full h-[400px]">
                {tableViewData && <NNPGrid rows={tableViewData.rows} columns={[]} getRowId={(row: any) => row.id} />}
            </div>
            <div className="flex-space-center h-[40vh] gap-[var(--nnp-padding-medium)]">
                {lineChartConfig && (
                    <div className="h-full w-[70%] mb-[var(--nnp-padding-medium)]">
                        <ReactECharts option={lineChartConfig} style={{ width: "100%", height: "100%" }}
                            opts={{ renderer: "canvas" }} />
                    </div>
                )}
                {pieChartConfig && (
                    <div className="h-full w-[30%] mb-[var(--nnp-padding-medium)]">
                        <ReactECharts option={pieChartConfig} style={{ width: "100%", height: "100%" }}
                            opts={{ renderer: "canvas" }} />
                    </div>
                )}
            </div> */}
            <div>Coming Soon...</div>

        </div>
    )
}

export default MarketplaceContributionComponent;


