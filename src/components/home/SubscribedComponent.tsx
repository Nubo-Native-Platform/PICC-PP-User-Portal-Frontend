import { PlanComponent, SubscribedPlanModel } from "@/models/apimodels/subscribed-plan";
import { ListItemsModel } from "@/models/listItemsModel";
import { SubscribedPlanToListItemsModel } from "@/services/ModelTranslator.service";
import ListView from "@/sharedComponents/ListView";
import { useEffect, useState } from "react";

const SubscribedPlan = ({ id, data }: { id: string, data: SubscribedPlanModel }) => {
    const [subscribedPlanData, setSubscribedPlanData] = useState<SubscribedPlanModel>(data);

    useEffect(() => {
        if (data) {
            setSubscribedPlanData(data);
        }
    }, [data]);

    return (
        <>
            {subscribedPlanData && (
                <div className="page-padding-medium">
                    <div className="font-[var(--font-bold)] text-[var(--font-size-large)]" style={{ color: 'var(--text-color-tertiary)' }}>
                        Subscribed Plan
                    </div>

                    <div className="pb-[var(--nnp-padding-medium)]">
                        {subscribedPlanData.subscribedPlan} : {subscribedPlanData.subscribedPlanCurrency}{subscribedPlanData.subscribedPlanBasePrice}
                        &nbsp;{`[disc : ${subscribedPlanData.subscribedPlanBaseDct}%]`}
                    </div>

                    {/* ✅ Loop over groups */}
                    {Object.entries(subscribedPlanData.planComponents || {}).map(([groupName, components]) => (
                        <div key={groupName} className="mb-6">

                            {/* ✅ Group Header */}
                            <div className="font-[var(--font-bold)] text-[var(--font-size-large)] mb-2" style={{ color: 'var(--text-color-tertiary)' }}>
                                {groupName}
                            </div>

                            {/* ✅ Component List */}
                            <ul className="ml-4 list-disc">
                                {(components as PlanComponent[]).map((comp: PlanComponent) => (
                                    <li key={comp.componentId} className="py-1">
                                        {comp.componentName}
                                        {typeof comp.pricePerDay === "object" && comp.pricePerDay?.amount !== undefined && (
                                            <span className="">
                                                &nbsp;: {comp.pricePerDay.currency}{comp.pricePerDay.amount}/day
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default SubscribedPlan;

