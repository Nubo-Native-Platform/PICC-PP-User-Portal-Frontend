import { useEffect, useRef, useState } from "react";
import { SubscribedPlanModel } from "@/models/apimodels/subscribed-plan"
import ChangePlanComponent from "./ChangePlanComponent";
import SelectPlanForm, { SelectPlanFormHandle } from "@/components/register/SelectPlan";
import KubernetesPodsDetails from "./KubernetesPodsDetails";

interface ManagePlanComponentProps {
    baseData: SubscribedPlanModel;
    additionalData: any[];
}

const ManagePlanComponent = ({ id, data }: { id: string, data: ManagePlanComponentProps }) => {

    const [planFormData, setPlanFormData] = useState({
        selectedPlan: null,
        hostPlanId: '',
        totalPrice: 0,
        planComps: [],
        planEffDate: new Date((new Date()).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    const planFormRef = useRef<SelectPlanFormHandle>(null);

    return (
        <div className="flex flex-col lg:flex-row">

            {/* LEFT SECTION */}
            <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[var(--border-color)]">
                <KubernetesPodsDetails />
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-1/2">
                <p className="pt-[var(--nnp-padding-large)] pl-[var(--nnp-padding-large)] font-bold">
                    Select the Plan you want to upgrade
                </p>
                <ChangePlanComponent
                    subscribedPlan={data.baseData}
                    allPlans={
                        data.additionalData && data.additionalData.length > 0
                            ? data.additionalData[0]
                            : []
                    }
                />
            </div>

        </div>
    )
}

export default ManagePlanComponent
