import { customAccordionOption } from "@/models/customAccordionOption";
import { use } from "echarts";
import { useEffect, useState } from "react";
import ChangePlanComponent from "@/components/account/ManagePlanComponent";
import AdminAPI from "@/services/AdminAPI";
import CookieService from "@/services/cookies";

interface OptionData {
    baseData: any;
    additionalData: any[];
}
const ChangePlanDataContainer = () => {

    const [dataOption, setDataOption] = useState<OptionData>({
        baseData: null,
        additionalData: [],
    });

    useEffect(() => {
        getDetails();
    }, [])

    const getDetails = async () => {
        const option = {
            url: "subscribedComponentUrl",
            additionalUrls: ["allPlansUrl"],
            data: {
                baseData: null,
                additionalData: [],
            }
        }
        const baseData = await AdminAPI.getData(
            option.url || "",
            CookieService.getEnvId() || "",
            true
        );

        let additionalData: any[] = [];

        if (option.additionalUrls && option.additionalUrls.length > 0) {
            additionalData = await Promise.all(
                option.additionalUrls.map((url) =>
                    AdminAPI.getData(url, CookieService.getEnvId() || "", true)
                )
            );

            option.data = {
                baseData,
                additionalData,
            };
        } else {
            option.data = baseData;
        }
        setDataOption({
            baseData: option?.data?.baseData,
            additionalData: option?.data?.additionalData,
        });
    };


    return (
        <div>
            {/* {dataOption.baseData && dataOption.additionalData && (
                <ChangePlanComponent subscribedPlan={dataOption.baseData} allPlans={dataOption.additionalData}></ChangePlanComponent>
            )} */}
        </div>
    )
}

export default ChangePlanDataContainer
