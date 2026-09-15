import { useEffect, useState } from "react";
import { BillingDetailsModel } from "@/models/apimodels/billing-details-model"
import { ListItem } from "@/models/listItemsModel";
import ChartConverterService from "@/services/chartConverter";
import { generateChartData } from "@/services/helper";
import { billingDetailsStackConfig } from "@/configs/ChartConfig";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import ListView from "@/sharedComponents/ListView";
import { billingDetailsToDisplayModel } from "@/services/ModelTranslator.service";
import { BillingDetailsDisplayModel } from "@/models/billingDetailsDisplayModel";
import CookieService from "@/services/cookies";


const BillingDetailsComponent = ({ id, data }: { id: string, data: BillingDetailsModel }) => {

  const [billingDetailsData, setBillingDetailsData] = useState<BillingDetailsDisplayModel>(null);
  const [billingSummary, setBillingSummary] = useState<ListItem>(null);
  const [stackChartConfigs, setStackChartConfig] = useState<EChartsOption>();


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
    }
  }, [billingDetailsData]);

  return (
    <div className="page-padding-medium">
      <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">Subscribed Plan&nbsp;:&nbsp;{billingDetailsData?.title?.replace(/\s*\(.*?\)\s*/g, "")}</div>
      {stackChartConfigs && (
        <div className="h-[50vh]">
          <ReactECharts option={stackChartConfigs} style={{ width: "100%", height: "100%" }}
            opts={{ renderer: "canvas" }} />
        </div>
      )}
      {billingSummary && <div>
        <ListView item={billingSummary} />
      </div>}
    </div>
  )
}

export default BillingDetailsComponent;
