// AccountDetailsForm.tsx
import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from "react";
import PublicSvc from "@/services/PublicSvc";
import { FieldConfig } from "@/models/formModel";
import { Tooltip } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Pattern } from "@mui/icons-material";
import { COMMON_PASSWORDS } from "@/constants/blacklistedPasswords";
import CookieService from "@/services/cookies";

const fields: any = {
    accName: { label: "Account Name", name: "accName", type: "text", value: "", editable: true, checked: undefined, validation: { required: true, notMatchField: "userId" } },
    userId: { label: "Primary User ID", name: "userId", type: "text", value: "", editable: true, checked: undefined, validation: { required: true, pattern: "^[a-zA-Z0-9_]{5,15}$", patternText: "Use 5–15 characters. Letters, numbers, and underscores only (no spaces or special characters).", notMatchField: "accName" } },
    userEmail: { label: "Primary User Email", name: "userEmail", type: "email", value: "", editable: true, checked: undefined, validation: { required: true, pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", patternText: "Enter a valid email address." } },
    password: {
        label: "Password", name: "password", type: "password", value: "", editable: true, validation: {
            required: true,
            custom: "passwordPolicy",
            patternText:
                "Password must be 12–15 characters, include upper & lower case letters, a number, not contain username, and not be a common password.",
        }
    },
    retypePassword: { label: "Retype Password", name: "retypePassword", type: "password", value: "", editable: true, validation: { required: true, minLength: 12, matchField: "password" } },
    countryCode: { label: "Country", name: "countryCode", type: "select", value: "", editable: true, validation: { required: true } },
    orgName: { label: "Organization Name", name: "orgName", type: "text", value: "", editable: true, validation: { required: false } },
    orgCategory: { label: "Organization Category", name: "orgCategory", type: "select", value: "", editable: true, validation: { required: false } },
    platformPourpose: { label: "Platform to be used for", name: "platformPourpose", type: "textarea", value: "", editable: true, validation: { required: false } },
};

export type AccountDetailsFormHandle = {
    isValid: () => boolean;
    submit: () => void;
};

export type AccountDetailsFormProps = {
    formData: any;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    personalFormData?: any;
};

const AccountDetailsForm = forwardRef<AccountDetailsFormHandle, AccountDetailsFormProps>(
    ({ formData, setFormData, personalFormData }, ref) => {
        const formRef = useRef<HTMLFormElement>(null);
        const [countries, setCountries] = useState<any[]>([]);
        const [orgCategories, setOrgCategories] = useState<any[]>([]);
        const [errors, setErrors] = useState<any>({});
        const [localFields, setLocalFields] = useState(fields);

        useImperativeHandle(ref, () => ({
            isValid: () => validateForm(),
            submit: () => formRef.current?.requestSubmit(),
        }));


        const handleValueChange = (name: string, value: any) => {
            if ("checked" in localFields[name]) {
                localFields[name].checked = undefined;
            }
            if (name === 'countryCode') {
                const country = countries.find(c => c.countryCode === value);
                if (country) {
                    CookieService.setCountry(country);
                }
            }
            setFormData((prev: any) => ({ ...prev, [name]: value }));
            const errorMsg = validateField(name, value);
            setErrors((prev: any) => ({ ...prev, [name]: errorMsg }));
        };

        const validateField = (name: string, value: any) => {
            const field = localFields[name];
            const v = field.validation || {};
            if (v.required && !value) return `${field.label}* is required`;
            if (v.pattern && !new RegExp(v.pattern).test(value)) return formatInfo(field, "pattern doesn't match");
            if (v.minLength && value.length < v.minLength) return `${field.label} must be at least ${v.minLength} characters`;
            if (v.matchField && value !== formData[v.matchField]) return `Passwords do not match`;
            if (v.notMatchField && value && formData[v.notMatchField] && value === formData[v.notMatchField]) return `${field.label} cannot be the same as ${localFields[v.notMatchField].label}`;
            if (v.custom === "passwordPolicy") {
                return passwordPolicyValidation(field, value);
            }
            return "";
        };

        const passwordPolicyValidation = (field: any, value: string) => {
            const username = formData.userId || "";
            const password = value || "";

            const hasLowercase = /[a-z]/.test(password);
            const hasUppercase = /[A-Z]/.test(password);
            const hasNumber = /\d/.test(password);

            if (password.length < 12 || password.length > 15) {
                return formatInfo(field, "must be between 12 and 15 characters.");
            }

            if (!hasLowercase) {
                return formatInfo(field, "must include at least one lowercase letter.");
            }

            if (!hasUppercase) {
                return formatInfo(field, "must include at least one uppercase letter.");
            }

            if (!hasNumber) {
                return formatInfo(field, "must include at least one number.");
            }

            if (username && password.toLowerCase().includes(username.toLowerCase())) {
                return formatInfo(field, "cannot contain the username.");
            }

            const firstName = personalFormData?.firstName || "";
            const lastName = personalFormData?.lastName || "";
            
            if (firstName && firstName.length >= 3 && password.toLowerCase().includes(firstName.toLowerCase())) {
                return formatInfo(field, "cannot contain the first name.");
            }
            
            if (lastName && lastName.length >= 3 && password.toLowerCase().includes(lastName.toLowerCase())) {
                return formatInfo(field, "cannot contain the last name.");
            }

            if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
                return formatInfo(field, "is too common. Choose a stronger one.");
            }
        }

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



        useEffect(() => {
            loadCountries();
            loadOrgCategories();
        }, []);

        const loadCountries = async () => {
            const res = await PublicSvc.getContries();
            setCountries(res || []);
        };

        const loadOrgCategories = async () => {
            const res = await PublicSvc.getOrgCategories();
            const categories = res?.["org-category"] || [];
            setOrgCategories(categories?.map(category => ({ label: category, value: category })) || []);
        };

        const checkUserIdAvailable = async () => {
            const errorMsg = validateField(localFields.userId.name, formData.userId);
            setErrors((prev: any) => ({ ...prev, [localFields.userId.name]: errorMsg ?? "" }));
            if (errorMsg) {
                return;
            } else {
                const res = await PublicSvc.userExist(formData.userId);
                setLocalFields((prev: any) => ({
                    ...prev,
                    userId: { ...prev.userId, checked: !res }, // update checked in state
                }));
            }
        };

        const checkAccAvailable = async () => {
            const errorMsg = validateField(localFields.accName.name, formData.accName);
            setErrors((prev: any) => ({ ...prev, [localFields.accName.name]: errorMsg ?? "" }));
            if (errorMsg) {
                return;
            } else {
                const res = await PublicSvc.accExist(formData.accName);
                setLocalFields((prev: any) => ({
                    ...prev,
                    accName: { ...prev.accName, checked: !res }, // update checked in state
                }));
            }
        };

        const checkUserEmailAvailable = async () => {
            const errorMsg = validateField(localFields.userEmail.name, formData.userEmail);
            setErrors((prev: any) => ({ ...prev, [localFields.userEmail.name]: errorMsg ?? "" }));
            if (errorMsg) {
                return;
            } else {
                const res = await PublicSvc.userEmailExists(formData.userEmail);
                setLocalFields((prev: any) => ({
                    ...prev,
                    userEmail: { ...prev.userEmail, checked: !res }, // update checked in state
                }));
            }
        };

        return (
            <form className="flex flex-col" ref={formRef}>
                {/* Account Name */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1 flex justify-between">
                        {errors[localFields.accName.name] && <span className="text-red-500">{errors[localFields.accName.name]}</span>}
                        {!errors[localFields.accName.name] && <span>
                            {localFields.accName.label}
                            {localFields.accName.validation?.required && "*"}
                        </span>}
                        {localFields.accName.checked == undefined && <span className="cursor-pointer text-blue-500" onClick={checkAccAvailable}>
                            check availability
                        </span>}
                        {localFields.accName.checked && <span className="cursor-pointer text-green-600">
                            available ✔
                        </span>}
                        {localFields.accName.checked === false && <span className="cursor-pointer text-red-500">
                            not available ✖
                        </span>}
                    </label>
                    <input
                        type={localFields.accName.type}
                        className="w-full p-2 border rounded-sm text-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.accName ?? ""}
                        required={localFields.accName.validation?.required}
                        onChange={(e) => handleValueChange(localFields.accName.name, e.target.value)}
                    />
                </div>

                {/* User ID */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1 flex justify-between">
                        {errors[localFields.userId.name] && <p className="text-red-500">{errors[localFields.userId.name]}</p>}
                        {!errors[localFields.userId.name] && <span>
                            {localFields.userId.label}
                            {localFields.userId.validation?.required && "*"}
                        </span>}
                        {localFields.userId.checked == undefined && <span className="cursor-pointer text-blue-500" onClick={checkUserIdAvailable}>
                            check availability
                        </span>}
                        {localFields.userId.checked && <span className="cursor-pointer text-green-600">
                            available ✔
                        </span>}
                        {localFields.userId.checked === false && <span className="cursor-pointer text-red-500">
                            not available ✖
                        </span>}
                    </label>
                    <input
                        type={localFields.userId.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.userId}
                        required={localFields.userId.validation?.required}
                        onChange={(e) => handleValueChange(localFields.userId.name, e.target.value)}
                    />
                </div>

                {/* User Email */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1 flex justify-between">
                        {errors[localFields.userEmail.name] && <p className="text-red-500">{errors[localFields.userEmail.name]}</p>}
                        {!errors[localFields.userEmail.name] && <span>
                            {localFields.userEmail.label}
                            {localFields.userEmail.validation?.required && "*"}
                        </span>}
                        {localFields.userEmail.checked === undefined && <span className="cursor-pointer text-blue-500" onClick={checkUserEmailAvailable}>
                            check availability
                        </span>}
                        {localFields.userEmail.checked && <span className="cursor-pointer text-green-600">
                            available ✔
                        </span>}
                        {localFields.userEmail.checked === false && <span className="cursor-pointer text-red-500">
                            not available ✖
                        </span>}
                    </label>
                    <input
                        type={localFields.userEmail.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.userEmail ?? ""}
                        required={localFields.userEmail.validation?.required}
                        onChange={(e) => handleValueChange(localFields.userEmail.name, e.target.value)}
                    />
                </div>

                {/* Password */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1">
                        {errors[localFields.password.name] && <p className="text-red-500">{errors[localFields.password.name]}</p>}
                        {!errors[localFields.password.name] && <span>{localFields.password.label}
                            {localFields.password.validation?.required && "*"}</span>}
                    </label>
                    <input
                        type={localFields.password.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.password ?? ""}
                        required={localFields.password.validation?.required}
                        onChange={(e) => handleValueChange(localFields.password.name, e.target.value)}
                    />
                </div>

                {/* Retype Password */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1">
                        {errors[localFields.retypePassword.name] && <p className="text-red-500">{errors[localFields.retypePassword.name]}</p>}
                        {!errors[localFields.retypePassword.name] && <span>{localFields.retypePassword.label}
                            {localFields.retypePassword.validation?.required && "*"}</span>}
                    </label>
                    <input
                        type={localFields.retypePassword.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.retypePassword ?? ""}
                        required={localFields.retypePassword.validation?.required}
                        onChange={(e) => handleValueChange(localFields.retypePassword.name, e.target.value)}
                    />
                </div>

                {/* Country */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="block text-gray-600 text-sm mt-1">
                        {errors[localFields.countryCode.name] && <p className="text-red-500">{errors[localFields.countryCode.name]}</p>}
                        {!errors[localFields.countryCode.name] && <span>{localFields.countryCode.label}
                            {localFields.countryCode.validation?.required && "*"}</span>}
                    </label>
                    <select
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.countryCode ?? ""}
                        required={localFields.countryCode.validation?.required}
                        onChange={(e) => handleValueChange(localFields.countryCode.name, e.target.value)}
                    >
                        <option value="">Select</option>
                        {countries.map((opt: any) => (
                            <option key={opt.countryId} value={opt.countryCode}>
                                {opt.taxCountry}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Organization Name */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="text-gray-600 text-sm mt-1">
                        {errors[localFields.orgName.name] && <p className="text-red-500">{errors[localFields.orgName.name]}</p>}
                        {!errors[localFields.orgName.name] && <span>{localFields.orgName.label}
                            {localFields.orgName.validation?.required && "*"}</span>}
                    </label>
                    <input
                        type={localFields.orgName.type}
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.orgName ?? ""}
                        required={localFields.orgName.validation?.required}
                        onChange={(e) => handleValueChange(localFields.orgName.name, e.target.value)}
                    />
                </div>

                {/* Organization Category (Select) */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="block text-gray-600 text-sm mt-1">
                        {errors[localFields.orgCategory.name] && <p className="text-red-500">{errors[localFields.orgCategory.name]}</p>}
                        {!errors[localFields.orgCategory.name] && <span>{localFields.orgCategory.label}
                            {localFields.orgCategory.validation?.required && "*"}</span>}
                    </label>
                    <select
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        value={formData.orgCategory ?? ""}
                        required={localFields.orgCategory.validation?.required}
                        onChange={(e) => handleValueChange(localFields.orgCategory.name, e.target.value)}
                    >
                        <option value="">Select</option>
                        {orgCategories && orgCategories.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Platform Purpose */}
                <div className="relative mb-2 font-xl pt-2">
                    <label className="block text-gray-600 text-sm mt-1">
                        {errors[localFields.platformPourpose.name] && <p className="text-red-500">{errors[localFields.platformPourpose.name]}</p>}
                        {!errors[localFields.platformPourpose.name] && <span>{localFields.platformPourpose.label}
                            {localFields.platformPourpose?.validation?.required && "*"}</span>}
                    </label>
                    <textarea
                        className="w-full p-2 border rounded-sm border-gray-600 focus:outline-none font-sm focus:border-blue-500"
                        rows={3}
                        value={formData.platformPourpose ?? ""}
                        required={localFields.platformPourpose.validation?.required}
                        onChange={(e) => handleValueChange(localFields.platformPourpose.name, e.target.value)}
                    />
                </div>
            </form>
        );
    }
);

export default AccountDetailsForm;
