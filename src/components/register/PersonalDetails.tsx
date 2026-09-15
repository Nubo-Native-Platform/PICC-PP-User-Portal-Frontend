// AccountDetailsForm.tsx
import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from "@mui/material";
import PublicSvc from "@/services/PublicSvc";

const personalDetailsFields: any = {
    firstName: { label: "First Name", name: "firstName", type: "text", value: "", editable: true, validation: { required: true } },
    lastName: { label: "Last Name", name: "lastName", type: "text", value: "", editable: true, validation: {} },
    contactEmail: { label: "Contact Email Id", name: "contactEmail", type: "email", value: "", editable: true, validation: { required: true, pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", patternText: "Enter a valid email address." } },
    contactNumber: { label: "Contact Number", name: "contactNumber", type: "tel", value: "", editable: true, validation: { required: true, pattern: "^[0-9]{10}$", patternText: "Enter a valid contact number." } },
    address: { label: "Address", name: "address", type: "textarea", value: "", editable: true, validation: {} },
};

export type PersonalDetailsFormHandle = {
    isValid: () => boolean;
    submit: () => void;
};

export type PersonalDetailsFormProps = {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    accFormData?: any;
};

const PersonalDetailsForm = forwardRef<PersonalDetailsFormHandle, PersonalDetailsFormProps>(
    ({ formData, setFormData, accFormData }, ref) => {
        const formRef = useRef<HTMLFormElement>(null);
        const [errors, setErrors] = useState<any>({});
        const [localFields, setLocalFields] = useState(personalDetailsFields);

        useImperativeHandle(ref, () => ({
            isValid: () => validateForm(),
            submit: () => formRef.current?.requestSubmit(),
        }));


        const handleValueChange = (name: string, value: any) => {
            if ("checked" in localFields[name]) {
                localFields[name].checked = undefined;
            }
            setFormData((prev: any) => ({ ...prev, [name]: value }));
            const errorMsg = validateField(name, value);
            setErrors((prev: any) => ({ ...prev, [name]: errorMsg }));
        };

        const validateField = (name: string, value: any) => {
            const field = localFields[name];
            const v = field.validation || {};
            if (v.required && !value) return `${field.label}* is required`;
            if (v.pattern && !new RegExp(v.pattern).test(value)) return formatInfo(field, "format is invalid");
            if (v.minLength && value.length < v.minLength) return `${field.label} must be at least ${v.minLength} characters`;
            if (v.matchField && value !== formData[v.matchField]) return `Passwords do not match`;
            
            const password = accFormData?.password || "";
            if (password) {
                if (name === "firstName" && value && value.length >= 3 && password.toLowerCase().includes(value.toLowerCase())) {
                    return `${field.label} cannot be part of the password`;
                }
                if (name === "lastName" && value && value.length >= 3 && password.toLowerCase().includes(value.toLowerCase())) {
                    return `${field.label} cannot be part of the password`;
                }
            }

            return "";
        };


        const validateForm = () => {
            const newErrors: any = {};
            let valid = true;

            Object.keys(localFields).forEach((key) => {
                const field = localFields[key];
                const value = formData[key];

                // Normal validations
                const error = validateField(key, value);
                if (error) {
                    valid = false;
                    newErrors[key] = error;
                }

                // Extra validation for "checked" fields
                if ("checked" in field) {
                    if (field.checked !== true) {
                        valid = false;
                        newErrors[key] = `${field.label} must be checked/verified`;
                    }
                }
            });

            setErrors(newErrors);
            return valid;
        };


        const formatInfo = (field: any, text: string) => {
            return (
                <span className="flex items-center gap-1">
                    {field.label} {text}
                    <Tooltip title={`${field.validation.patternText}`} arrow>
                        <InfoOutlinedIcon
                            fontSize="inherit"
                            className="text-red-500 cursor-pointer relative top-[1px]"
                        />

                    </Tooltip>
                </span>
            )
        }



        useEffect(() => {
        }, []);

        const checkUserEmailAvailable = async () => {
            const errorMsg = validateField(localFields.contactEmail.name, formData.contactEmail);
            setErrors((prev: any) => ({ ...prev, [localFields.contactEmail.name]: errorMsg ?? "" }));
            if (errorMsg) {
                return;
            } else {
                const res = await PublicSvc.userEmailExists(formData.contactEmail);
                setLocalFields((prev: any) => ({
                    ...prev,
                    contactEmail: { ...prev.contactEmail, checked: !res }, // update checked in state
                }));
            }
        };


        return (
            <form className="flex flex-col" ref={formRef}>
                {/* Account Name */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1 flex justify-between">
                        {errors[localFields.firstName.name] && <span className="text-red-500">{errors[localFields.firstName.name]}</span>}
                        {!errors[localFields.firstName.name] && <span>
                            {localFields.firstName.label}
                            {localFields.firstName.validation?.required && "*"}
                        </span>}
                    </label>
                    <input
                        type={localFields.firstName.type}
                        className="w-full p-2 border rounded-sm text-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.firstName ?? ""}
                        required={localFields.firstName.validation?.required}
                        onChange={(e) => handleValueChange(localFields.firstName.name, e.target.value)}
                    />
                </div>

                {/* User ID */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1 flex justify-between">
                        {errors[localFields.lastName.name] && <p className="text-red-500">{errors[localFields.lastName.name]}</p>}
                        {!errors[localFields.lastName.name] && <span>
                            {localFields.lastName.label}
                            {localFields.lastName.validation?.required && "*"}
                        </span>}
                    </label>
                    <input
                        type={localFields.lastName.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.lastName}
                        required={localFields.lastName.validation?.required}
                        onChange={(e) => handleValueChange(localFields.lastName.name, e.target.value)}
                    />
                </div>

                {/* User Email */}
                <div className="relative mb-2 font-xl pt-2">
                     {/* <label className="text-gray-600 text-sm mt-1 flex justify-between">
                        {errors[localFields.contactEmail.name] && <p className="text-red-500">{errors[localFields.contactEmail.name]}</p>}
                        {!errors[localFields.contactEmail.name] && <span>
                            {localFields.contactEmail.label}
                            {localFields.contactEmail.validation?.required && "*"}
                        </span>}
                    </label> */}
                    <label className="text-gray-600 text-sm mt-1 flex justify-between">
                        {errors[localFields.contactEmail.name] && <p className="text-red-500">{errors[localFields.contactEmail.name]}</p>}
                        {!errors[localFields.contactEmail.name] && <span>
                            {localFields.contactEmail.label}
                            {localFields.contactEmail.validation?.required && "*"}
                        </span>}
                        {localFields.contactEmail.checked === undefined && <span className="cursor-pointer text-blue-500" onClick={checkUserEmailAvailable}>
                            check availability
                        </span>}
                        {localFields.contactEmail.checked && <span className="cursor-pointer text-green-600">
                            available ✔
                        </span>}
                        {localFields.contactEmail.checked === false && <span className="cursor-pointer text-red-500">
                            not available ✖
                        </span>}
                    </label>
                    <input
                        type={localFields.contactEmail.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.contactEmail ?? ""}
                        required={localFields.contactEmail.validation?.required}
                        onChange={(e) => handleValueChange(localFields.contactEmail.name, e.target.value)}
                    />
                </div>

                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1">
                        {errors[localFields.contactNumber.name] && <p className="text-red-500">{errors[localFields.contactNumber.name]}</p>}
                        {!errors[localFields.contactNumber.name] && <span>{localFields.contactNumber.label}
                            {localFields.contactNumber.validation?.required && "*"}</span>}
                    </label>
                    <input
                        type={localFields.contactNumber.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.contactNumber ?? ""}
                        required={localFields.contactNumber.validation?.required}
                        onChange={(e) => handleValueChange(localFields.contactNumber.name, e.target.value)}
                    />
                </div>

                <div className="relative mb-2 font-xl pt-2">
                    <label className="block text-gray-600 text-sm mt-1">
                        {errors[localFields.address.name] && <p className="text-red-500">{errors[localFields.address.name]}</p>}
                        {!errors[localFields.address.name] && <span>{localFields.address.label}
                            {localFields.address.validation?.required && "*"}</span>}
                    </label>
                    <textarea
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        rows={3}
                        value={formData.address ?? ""}
                        required={localFields.address.validation?.required}
                        onChange={(e) => handleValueChange(localFields.address.name, e.target.value)}
                    />
                </div>
            </form>
        );
    }
);

export default PersonalDetailsForm;
