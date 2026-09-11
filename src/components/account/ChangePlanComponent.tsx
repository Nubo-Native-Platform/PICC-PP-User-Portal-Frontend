import { useState, useEffect } from "react";
import FormComponent from "@/sharedComponents/FormComponent";
import { PLAN_CHANGE_FORM_CONFIG } from "@/configs/FormConfig"; // Assuming your config is stored here
import { PlanComponent, SubscribedPlanModel } from "@/models/apimodels/subscribed-plan";
import { formatPlanChangeFormConfig } from "@/services/ModelTranslator.service"; // Assuming you have a utility to format the form config
import { FieldConfig } from "@/models/formModel";
import { PlanModel } from "@/models/planModel";
import AdminAPI from "@/services/AdminAPI";
import CookieService from "@/services/cookies";
import { calculateDiscount } from "@/services/Utils";

const ChangePlanComponent = ({ subscribedPlan, allPlans }: { subscribedPlan: SubscribedPlanModel, allPlans: PlanModel[] }) => {
    const [formFields, setFormFields] = useState<FieldConfig[]>([]);


    // useEffect(() => {
    //     if (subscribedPlan && allPlans.length) {
    //         const fields: FieldConfig[] = formatPlanChangeFormConfig(PLAN_CHANGE_FORM_CONFIG, allPlans, subscribedPlan);
    //         const btnField = fields.filter(field => field.type === 'button');
    //         btnField[0].value = (fields) => handleSubmit(fields);
    //         setFormFields(fields);
    //     }
    // }, []);

    useEffect(() => {
        if (subscribedPlan && subscribedPlan.subscribedPlanId && allPlans && allPlans.length) {
            const fields: FieldConfig[] = formatPlanChangeFormConfig(
                PLAN_CHANGE_FORM_CONFIG,
                allPlans,
                subscribedPlan
            );

            // ✅ Preselect the subscribed plan
            const planFieldIndex = fields.findIndex(f => f.name === "plan");
            if (planFieldIndex !== -1) {
                fields[planFieldIndex].value = subscribedPlan["subscribedPlanId"];
            }

            // ✅ Set button handler
            const btnField = fields.find(field => field.type === "button");
            if (btnField) {
                btnField.value = (fields) => handleSubmit(fields);
            }

            setFormFields(fields);

            // ✅ After form fields are set, fetch plan components
            handleChange("plan", subscribedPlan["subscribedPlanId"]);
        }
    }, [subscribedPlan, allPlans]);



    const handleChange = async (name: string, value: string | string[]) => {
        console.log(`Field changed: ${name} = ${value}`);

        // 🟡 PLAN CHANGE — fetch plan components
        if (name.toLowerCase() === "plan") {
            const planComponents = await AdminAPI.getPlanComponents(value as string);

            setFormFields(prevFields => {
                // Remove old component groups before adding new ones
                const nonComponentFields = prevFields.filter(
                    field => field.type !== "checkbox"
                );

                const selectedPlan = allPlans.find(plan => plan.hostPlanid.toString() === value.toString());

                // ✅ Update both 'plan' and 'viewPlanDetails' fields
                const updatedFields = nonComponentFields.map(field => {
                    if (field.name === "plan") {
                        return { ...field, value };
                    } else if (field.name === "viewPlanDetails") {
                        return { ...field, value: selectedPlan?.hostPlanDtlPageLink || "" };
                    }
                    return field;
                });

                // ✅ Generate new component groups from API
                const newComponentFields: FieldConfig[] = Object.entries(planComponents).flatMap(
                    ([groupName, comps]) => {
                        const compArray = comps as any[];

                        const options = compArray.map(pc => ({
                            label: `${pc.compName} : ${CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : '$'} ${(Number(pc.baseDayPrice) || 0) * 30}`,
                            value: pc.compId,
                            price: (Number(pc.baseDayPrice) || 0) * 30,
                            selectionType: pc.selectionType,
                            disabled: pc.selectionType === "mandatory",
                        }));

                        // ✅ Preselect: mandatory + already subscribed components
                        const subscribedComponentIds = Object.values(subscribedPlan?.planComponents || {})
                            .flatMap((components: PlanComponent[]) =>
                                components.map((comp) => comp.componentId)
                            );
                        const newValue = options
                            .filter(opt =>
                                opt.selectionType === "mandatory" ||
                                subscribedComponentIds.includes(opt.value)
                            )
                            .map(opt => opt.value);

                        return [{
                            name: `${groupName}`,
                            label: groupName,
                            type: "checkbox",
                            options,
                            value: newValue,
                        } as FieldConfig];
                    }
                );

                // Insert new component fields right after the plan field
                const planIndex = updatedFields.findIndex(f => f.name === "plan");
                const viewDetailsIndex = updatedFields.findIndex(f => f.name === "viewPlanDetails");

                const insertAfterIndex =
                    viewDetailsIndex !== -1 ? viewDetailsIndex : planIndex;

                const reorderedFields =
                    insertAfterIndex === -1
                        ? [...updatedFields, ...newComponentFields]
                        : [
                            ...updatedFields.slice(0, insertAfterIndex + 1),
                            ...newComponentFields,
                            ...updatedFields.slice(insertAfterIndex + 1),
                        ];

                // ✅ Calculate total cost based on preselected components
                const componentTotal = newComponentFields.reduce((sum, field) => {
                    const selected = field.value as string[];
                    const total = field.options
                        ?.filter(opt => typeof opt === "object" && selected.includes(opt.value))
                        .reduce((acc, opt) => acc + (typeof opt === "object" ? opt.price : 0), 0) || 0;
                    return sum + total;
                }, 0);

                const total = (Number(selectedPlan?.hostPlanBasePr) || 0) + componentTotal;
                const discountedPrice = calculateDiscount(total, selectedPlan?.hostDefaultDct || 0);

                // ✅ Update monthly cost field
                return reorderedFields.map(f =>
                    f.name === "monthlyCost"
                        ? { ...f, value: `${CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : '$'} ${discountedPrice}` }
                        : f
                );
            });

            return;
        }

        // 🟢 COMPONENT CHECKBOX CHANGE — recalc total
        setFormFields(prevFields => {
            const updatedFields = prevFields.map(field =>
                field.name === name ? { ...field, value } : field
            );

            const checkboxFields = updatedFields.filter(f => f.type === "checkbox");

            // ✅ Recalculate total cost based on selected checkboxes
            let total = 0;
            checkboxFields.forEach(field => {
                const selectedValues = field.value as string[];
                field.options?.forEach(opt => {
                    if (selectedValues.includes(opt.value)) {
                        total += opt.price || 0;
                    }
                });
            });

            // ✅ Update monthly cost field
            return updatedFields.map(f =>
                f.name === "monthlyCost" ? { ...f, value: `${CookieService.getCountryCurrency() ? CookieService.getCountryCurrency() : '$'} ${total}` } : f
            );
        });
    };



    const handleSubmit = (fields) => {
        console.log("Form submitted with data:", fields);
    };

    return (
        <div className="page-padding-large">
            <FormComponent
                fields={formFields}
                onChange={handleChange}
            />
        </div>

    );
}

export default ChangePlanComponent;