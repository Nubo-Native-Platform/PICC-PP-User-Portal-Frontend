import { DETAILS_PERSONAL_FORM_CONFIG } from "@/configs/FormConfig";
import { FieldConfig } from "@/models/formModel";
import AdminAPI from "@/services/AdminAPI";
import CookieService from "@/services/cookies";
import { showConfirmDialog } from "@/sharedComponents/ConfirmDialog";
import FormComponent from "@/sharedComponents/FormComponent";
import NNPFormComponent from "@/sharedComponents/NNPFormComponent";
import { useEffect, useRef, useState } from "react";
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";

const AccountDetailsPersonalFormComponent = ({ id }: { id: string }) => {
    const [personalFormConfig, setPersonalFormConfig] = useState<any[]>([]);
    const [personalData, setPersonalData] = useState<any>(null);
    const formRef = useRef<{ setError: UseFormSetError<any>; clearErrors: UseFormClearErrors<any> }>(null);

    useEffect(() => {
        getAccountDetails();
    }, []);

    const getAccountDetails = async () => {
        if (!CookieService.getEnvId()) return;
        const res = await AdminAPI.getAccountDetails(CookieService.getEnvId() || "");
        if (res && res.contactName != undefined) {
            setPersonalData(res);
        }
    }

    useEffect(() => {
        const fields: FieldConfig[] = JSON.parse(JSON.stringify(DETAILS_PERSONAL_FORM_CONFIG));
        const btnField = fields.filter(field => field.type === 'button');
        btnField[0].value = (fields) => handleSubmit(fields);
        setPersonalFormConfig(fields);
    }, []);

    const handleFieldChange = (name: string, value: string) => {
        setPersonalFormConfig((prev) =>
            (prev ?? []).map((field) =>
                field.name === name ? { ...field, value } : field
            )
        );
    };

    const handleSubmit = async (fields: FieldConfig[]) => {
        const res = await AdminAPI.putAccountDetails(CookieService.getEnvId() || "", fields);
        if (res.status === 200) {
            showConfirmDialog({
                type: "success",
                message: res?.data?.message || "Account details updated successfully.",
                confirmText: "OK",
            });
            getAccountDetails();
        }
    };


    return (
        <div className="page-padding-large">
            {/* <FormComponent fields={personalFormFields} onChange={handleFieldChange} /> */}
            {<NNPFormComponent
                ref={formRef}
                inputs={personalFormConfig ?? []} layout="single" onSubmit={handleSubmit} defaultValues={personalData || {}} onTrigger={(name, value) => {
                }} />}
        </div>


    );
}

export default AccountDetailsPersonalFormComponent
