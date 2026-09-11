import { DETAILS_BILLING_FORM_CONFIG } from "@/configs/FormConfig";
import { FieldConfig } from "@/models/formModel";
import FormComponent from "@/sharedComponents/FormComponent";
import { useEffect, useState } from "react";

export const AccountDetailsBillingFormComponent = () => {
    const [billingFormFields, setBillingFormFields] = useState<any[]>([]);

    useEffect(() => {
        const fields: FieldConfig[] = JSON.parse(JSON.stringify(DETAILS_BILLING_FORM_CONFIG));
        const btnField = fields.filter(field => field.type === 'button');
        btnField[0].value = (fields) => handleSubmit(fields);
        setBillingFormFields(fields);
    }, []);

    const handleFieldChange = (name: string, value: string) => {
        setBillingFormFields((prev) =>
            (prev ?? []).map((field) =>
                field.name === name ? { ...field, value } : field
            )
        );
    };

    const handleSubmit = (fields: FieldConfig[]) => {
        const formData = Object.fromEntries(fields.map(f => [f.name, f.value]));
        console.log("Form Submitted:", formData);
        // you can call your API here
    };

    return (
        <div className="">
            <FormComponent fields={billingFormFields} onChange={handleFieldChange} />
        </div>
    )
}

export default AccountDetailsBillingFormComponent;
