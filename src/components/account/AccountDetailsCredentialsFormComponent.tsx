import { DETAILS_CREDENTIALS_FORM_CONFIG } from "@/configs/FormConfig";
import { FieldConfig } from "@/models/formModel";
import AdminAPI from "@/services/AdminAPI";
import CookieService from "@/services/cookies";
import FormComponent from "@/sharedComponents/FormComponent";
import NNPFormComponent from "@/sharedComponents/NNPFormComponent";
import { useEffect, useRef, useState } from "react";
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";

const AccountDetailsCredentialsFormComponent = () => {
    const [credentialFormConfig, setCredentialFormConfig] = useState<any[]>([]);
    const [credentialData, setCredentialData] = useState<any>(null);
    const formRef = useRef<{ setError: UseFormSetError<any>; clearErrors: UseFormClearErrors<any> }>(null);

    useEffect(() => {
        getAccountDetails();
    }, []);

    const getAccountDetails = async () => {
        if (!CookieService.getEnvId()) return;
        const res = await AdminAPI.getAccountDetails(CookieService.getEnvId() || "");
        if (res && res.userAccess != undefined) {
            setCredentialData(res);
        }
    }

    useEffect(() => {
        const fields: FieldConfig[] = JSON.parse(JSON.stringify(DETAILS_CREDENTIALS_FORM_CONFIG));
        const btnField = fields.filter(field => field.type === 'button');
        btnField[0].value = (fields) => handleSubmit(fields);
        setCredentialFormConfig(fields);
    }, []);


    const handleFieldChange = (name: string, value: string) => {
        setCredentialFormConfig((prev) =>
            (prev ?? []).map((field) =>
                field.name === name ? { ...field, value } : field
            )
        );

    };

    const handleSubmit = (fields: any) => {
        const text =
            `Admin access : ${fields.administrativeAccess}\n` +
            `User access : ${fields.userAccess}`;

        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "access-details.txt";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="page-padding-large">
            {/* <FormComponent fields={personalFormFields} onChange={handleFieldChange} /> */}
            {<NNPFormComponent
                ref={formRef}
                inputs={credentialFormConfig ?? []} layout="single" onSubmit={handleSubmit} defaultValues={credentialData || {}} onTrigger={(name, value) => {
                }} />}
        </div>
    );
}

export default AccountDetailsCredentialsFormComponent
