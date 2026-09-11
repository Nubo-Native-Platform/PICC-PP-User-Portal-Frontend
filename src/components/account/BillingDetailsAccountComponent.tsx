import { billingDetailsStackConfig } from "@/configs/ChartConfig";
import { BillingDetailsModel } from "@/models/apimodels/billing-details-model";
import { BillingDetailsDisplayModel } from "@/models/billingDetailsDisplayModel";
import { ListItem } from "@/models/listItemsModel";
import { generateChartData } from "@/services/helper";
import { billingDetailsToDisplayModel } from "@/services/ModelTranslator.service";
import { EChartsOption } from "echarts";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import ListView from "@/sharedComponents/ListView";
import { CustomTableModel } from "@/models/customTableModel";
import NNPGrid from "@/sharedComponents/Datagrid";
import { type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CookieService from "@/services/cookies";
import { loaderController } from "@/services/loaderController";
import PublicSvc from "@/services/PublicSvc";

const BillingDetailsAccountComponent = ({ id, data }: { id: string, data: BillingDetailsModel }) => {
    const [billingDetailsData, setBillingDetailsData] = useState<BillingDetailsDisplayModel>(null);
    const [billingSummary, setBillingSummary] = useState<ListItem>(null);
    const [stackChartConfigs, setStackChartConfig] = useState<EChartsOption>();
    const [pastBilling, setPastBilling] = useState<CustomTableModel>();
    const [currentBillAmount, setCurrentBillAmount] = useState<number>(0);



    useEffect(() => {
        if (data) {
            setBillingDetailsData(billingDetailsToDisplayModel(data));
        }
    }, [data]);

    useEffect(() => {
        if (billingDetailsData) {
            const { categories, billAmount, paidAmount } = billingDetailsData.formattedBillingData;
            const seriesData = [
                { name: `Bill Amount (${CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : ''})`, data: billAmount },
                { name: `Paid Amount (${CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : ''})`, data: paidAmount }
            ];
            const configData: EChartsOption = generateChartData(billingDetailsStackConfig, categories, seriesData, 'bar');
            setStackChartConfig(configData);
            setBillingSummary(billingDetailsData.billingSummary);
            setPastBilling(billingDetailsData.pastBillingData);
            setCurrentBillAmount(billingDetailsData.currentBillAmount);
        }
    }, [billingDetailsData]);


    const cellClicked = (col, value) => {
        if (col.field === "invoiceUrl" && value.invoiceUrl) {
            window.open(value.invoiceUrl, '_blank');
        }
    }
    const payNow = async () => {
        console.log("Pay Now clicked");
        loaderController.show();
        const response = await PublicSvc.postPayment({ "accountId": CookieService.getEnvId() });
        if (response.data && response.data.url) {
            loaderController.hide();
            window.location.replace(response.data.url);
        } else {
            loaderController.hide();
        }
    }

    const currency = CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : '$';
    const columns: GridColDef[] = [
        { field: "month", headerName: "Month", flex: 1 },
        { field: "billAmount", headerName: `Bill Amount (${currency})`, flex: 1, type: 'number' },
        { field: "paidAmount", headerName: `Paid Amount (${currency})`, flex: 1, type: 'number' },
        {
            field: "invoiceUrl",
            headerName: "Invoice",
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                params.row.invoiceUrl ? (
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(params.row.invoiceUrl, '_blank');
                        }}
                    >
                        <DescriptionOutlinedIcon color="primary" />
                    </IconButton>
                ) : null
            )
        }
    ];

    return (
        <div className="flex flex-col lg:flex-row justify-between gap-[var(--nnp-padding-large)]">

            {/* LEFT SECTION */}
            <div className="
        w-full lg:w-1/2 
        page-padding-medium 
        border-b lg:border-b-0 lg:border-r 
        border-[var(--border-color)]
    ">
                <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">
                    Subscribed Plan&nbsp;:&nbsp;{billingDetailsData?.title?.replace(/\s*\(.*?\)\s*/g, "")}
                </div>

                <div className="pb-[var(--nnp-padding-medium)]">
                    Monthly Billing Details
                </div>

                <div className="flex-center-center">
                    {stackChartConfigs && (
                        <div className="h-[40vh] sm:h-[45vh] lg:h-[50vh] w-full">
                            <ReactECharts
                                option={stackChartConfigs}
                                style={{ width: "100%", height: "100%" }}
                                opts={{ renderer: "canvas" }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-1/2 page-padding-medium">
                <div className="mb-[var(--nnp-padding-large)]">
                    {pastBilling && (
                        <div className="w-full" style={{ height: "300px" }}>
                            <NNPGrid
                                rows={pastBilling.rows}
                                columns={columns}
                                getRowId={(row: any) => row.id}
                            />
                        </div>
                    )}

                    <div className="flex justify-end mt-4">
                        <button
                            disabled={currentBillAmount === 0}
                            type="button"
                            onClick={() => payNow()}
                            className={`nnp-btn nnp-btn-primary ${currentBillAmount === 0 ? "nnp-btn-disabled" : ""
                                }`}
                        >
                            Pay Now
                        </button>
                    </div>
                </div>

                {billingSummary && (
                    <div>
                        <ListView item={billingSummary} />
                    </div>
                )}
            </div>

        </div>
    )
}

export default BillingDetailsAccountComponent
