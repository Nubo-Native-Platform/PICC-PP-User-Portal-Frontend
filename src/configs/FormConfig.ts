import { FieldConfig } from "@/models/formModel";
import { InputConfig } from "@/models/NNPFormModel";
import { IssueCategories, IssuePriorities, IssueStatus } from "./IssueConfig";
import { COMMON_PASSWORDS } from "@/constants/blacklistedPasswords";

export const LOGIN_FORM_CONFIG =
    [
        { label: "Account", name: "envId", type: "text", value: "", placeholder: "Enter your Account Name", editable: true, validation: { required: true }, },
        { label: "Username", name: "userId", type: "text", value: "", placeholder: "Enter your Username", editable: true, validation: { required: true }, },
        { label: "Password", name: "password", type: "password", value: "", placeholder: "Enter your Password", editable: true, validation: { required: true }, },
        { label: "Forgot Password", name: "forgotPasswordBtn", type: "button", buttonType: "", value: null, variant: "secondary" },
        { label: "Login", name: "loginBtn", type: "button", buttonType: "submit", value: null, variant: "primary" },
    ]

export const PASSWORD_CHANGE_CONFIG =
    [
        { label: "Current Password", name: "currentPassword", type: "password", value: "", editable: true, validation: { required: true }, },
        { label: "New Password", name: "newPassword", type: "password", value: "", editable: true, validation: { required: true }, },
        { label: "Confirm Password", name: "confirmPassword", type: "password", value: "", editable: true, validation: { required: true }, },
    ]

export const DETAILS_PERSONAL_FORM_CONFIG =
    [
        { label: "Contact Name", name: "contactName", type: 'text', value: "", editable: true, validation: { required: true }, },
        { label: "Email", name: "email", type: "email", value: "", editable: true, validation: { required: true }, },
        { label: "Phone", name: "phone", type: "text", value: "", editable: true, validation: { required: true } },
        { label: "Address", name: "address", type: "text", value: "", editable: true, validation: { required: true } },
        // { label: "Organization", name: "organization", type: "text", value: "", editable: true, validation: { required: true } },
        // { label: "Organization Category", name: "organizationCategory", type: "text", value: "", editable: true, validation: { required: true } },
        { label: "Platform is used for", name: "platformUsePurpose", type: "textarea", value: "", editable: true, validation: { required: true } },
        { label: "Update", name: "updateBtn", type: "button", buttonType: "submit", value: null }
    ]

export const DETAILS_BILLING_FORM_CONFIG =
    [
        { label: "Bill Date", name: "billDate", value: "2023-01-01", type: 'date', editable: true, validation: { required: true } },
        { label: "Payment Method", name: "paymentMethod", type: "radio", value: { label: "Account", value: "acc" }, options: [{ label: "Credit Card", value: "cred" }, { label: "Account", value: "acc" }], validation: { required: true } },
        { label: "Card Number", name: "cardNumber", type: "text", value: '', editable: true, validation: { required: true } },
        { label: "Exp Date", name: "expDate", type: 'date', value: "", editable: true, validation: { required: true } },
        { label: "Verification Code", name: "verificationCode", type: "text", value: "", editable: true, validation: { required: true } },
        { label: "Account Number", name: "accountNumber", type: "text", value: "", editable: true },
        { label: "Bank Name", name: "bankName", type: "text", value: "", editable: true },
        { label: "Swift Code", name: "swiftCode", type: "text", value: "", editable: true },
        { label: "Invoice Additional Email", name: "additionalEmail", type: "text", value: "", editable: true },
        { label: "Update", name: "updateBtn", type: "button", value: null }
    ]

export const DETAILS_CREDENTIALS_FORM_CONFIG = [
    { label: "Administrative Access", name: "administrativeAccess", type: "textarea", value: "", disabled: true },
    { label: "User Access", name: "userAccess", type: "textarea", value: "", disabled: true },
    // { label: "Prev", name: "prevBtn", type: "button", value: null },
    { label: "Download", name: "downloadBtn", type: "button", buttonType: "submit", value: null }
]

export const PLAN_CHANGE_FORM_CONFIG: FieldConfig[] = [
    {
        name: "plan",
        label: "Change Plan :",
        type: "select",
        value: "",
    },
    {
        name: "viewPlanDetails",
        label: "View Details",
        type: "link",
        value: ""
    },
    {
        name: "components",
        label: "Select Plan Components",
        type: "checkbox",
        options: [],
        value: [],
    },
    /*
    {
        name: "quota",
        label: "No of such Quota",
        type: "select",
        options: [{ label: "0", value: "0" }, { label: "1", value: "1" }, { label: "2", value: "2" }, { label: "3", value: "3" }, { label: "4", value: "4" }],
        value: "0",
    },
    */
    {
        name: "effectiveDate",
        label: "Plan Effective From Date*",
        value: "",
        type: "date",
        validation: {
            minDate: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 2);
                return date.toISOString().split("T")[0]; // format: YYYY-MM-DD
            })()
        },
    },
    {
        name: "monthlyCost",
        label: "Monthly Cost for Selected Components (after discount)",
        value: "",
        type: "text",
        disabled: true,
    },
    { label: "Update", name: "updateBtn", type: "button", disabled: true, value: null }
];

export const USER_ADDITION_FORM_CONFIG: InputConfig = [
    {
        name: 'registerEmail',
        label: 'Email',
        type: "groupTextButton",
        placeholder: 'Enter Email',
        triggerName: "Check",
        validation: {
            required: 'Email is required',
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
            }
        },
    },
    {
        name: "registerUsername",
        label: "Username",
        type: "groupTextButton",
        placeholder: "Enter Username",
        triggerName: "Check",
        validation: {
            required: "Username is required",
            pattern: {
                value: /^[a-zA-Z0-9_]{5,15}$/,
                message: "Username must be 5–15 characters and contain only letters, numbers, and underscores (no spaces or special characters)",
            }
        },
    },
    {
        type: 'text',
        name: 'registerFirstName',
        label: 'First Name',
        placeholder: 'Enter First Name',
        validation: { required: 'First Name is required' },
    },
    {
        type: 'text',
        name: 'registerLastName',
        label: 'Last Name',
        placeholder: 'Enter Last Name',
        validation: {},
    },
    {
        type: 'text',
        name: 'registerContactNo',
        label: 'Contact No.',
        placeholder: 'Contact No.',
        validation: {
            required: 'Contact No. is required',
            pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit contact number',
            }
        },
    },
    {
        type: 'password',
        name: 'registerPassword',
        label: 'Password',
        placeholder: 'Enter Password',
        validation: {
            required: 'Password is required',
            validate: (value: string, formValues: any) => {
                const username = (formValues.registerUsername || "").toLowerCase().trim();
                const firstName = (formValues.registerFirstName || "").toLowerCase().trim();
                const lastName = (formValues.registerLastName || "").toLowerCase().trim();
                const password = (value || "").toLowerCase().trim();

                if (password.length < 12 || password.length > 15) {
                    return "Password must be between 12 and 15 characters";
                }

                const rawPassword = value || "";
                const hasLowercase = /[a-z]/.test(rawPassword);
                const hasUppercase = /[A-Z]/.test(rawPassword);
                const hasNumber = /\d/.test(rawPassword);

                if (!hasLowercase) {
                    return "Password must include at least one lowercase letter";
                }
                if (!hasUppercase) {
                    return "Password must include at least one uppercase letter";
                }
                if (!hasNumber) {
                    return "Password must include at least one number";
                }
                if (username && username.length >= 3 && password.includes(username)) {
                    return "Password cannot contain the username";
                }
                if (firstName && firstName.length >= 3 && password.includes(firstName)) {
                    return "Password cannot contain your first name";
                }
                if (lastName && lastName.length >= 3 && password.includes(lastName)) {
                    return "Password cannot contain your last name";
                }
                if (COMMON_PASSWORDS.includes(password)) {
                    return "Password is too common. Choose a stronger one";
                }
                return true;
            }
        }
    },
    {
        type: 'password',
        name: 'registerRetypePassword',
        label: 'Retype Password',
        placeholder: 'Enter Retype Password',
        validation: {
            required: 'Please retype your password',
            validate: (value: string, formValues: any) => {
                if (value !== formValues.registerPassword) {
                    return 'Passwords do not match';
                }
                return true;
            },
        }
    },
    {
        type: 'select',
        name: 'registerUserRole',
        label: 'Role',
        placeholder: 'Enter Role',
        validation: { required: 'Role is required' },
    },
    {
        type: 'select',
        name: 'registerUserStatus',
        label: 'Status',
        placeholder: 'Enter Status',
        validation: { required: 'Status is required' },
    },
    {
        type: 'button',
        buttonType: 'submit',
        name: 'registerSubmit',
        label: 'Add User',
    }
];


export const CreateIssueFormConfig: InputConfig = [
    {
        name: "issueName",
        label: "Subject",
        type: "text",
        placeholder: "Enter Subject",
        validation: { required: "Subject is required" },
    },
    {
        type: 'textarea',
        name: 'issueDescription',
        label: 'Description',
        placeholder: 'Enter Issue Description',
        width: 'full',
    },
    {
        type: 'select',
        name: 'issueCategory',
        label: 'Issue Category',
        options: [],
        optionUrl: 'getIssueCategories',
        placeholder: 'Enter Issue Category',
        validation: { required: 'Issue Category is required' },
    },
    {
        type: 'select',
        name: 'issuePriority',
        label: 'Priority',
        options: [],
        optionUrl: 'getIssuePriority',
        placeholder: 'Enter Issue Priority',
        validation: { required: 'Issue Priority is required' },
    },
    {
        type: 'select',
        name: 'issueCategoryType',
        label: 'Category Type',
        options: [],
        optionUrl: 'getIssueCategoriesType',
        placeholder: 'Enter Issue Category Type',
        validation: { required: 'Issue Category Type is required' },
    },
    {
        type: 'select',
        name: 'issueStatus',
        label: 'Status',
        options: [],
        optionUrl: 'getIssueStatus',
        placeholder: 'Enter Issue Status',
        validation: { required: 'Issue Status is required' },
    }
    // {
    //     type: 'text',
    //     name: 'issueStatus',
    //     label: 'Status',
    //     options: IssueStatus,
    //     placeholder: 'Enter Issue Status',
    //     validation: {},
    // },
    /*
    {
        type: 'submit',
        name: 'issueSubmit',
        label: 'Add Issue',
    }
    */

];
export const ProxyFormConfig: InputConfig = [
    {
        name: "parentFrontend",
        label: "Parent Frontend",
        type: "text",
        placeholder: "Enter Parent Frontend",
        validation: { required: "Parent Frontend is required" },
    },
    {
        name: "subpath",
        label: "Subpath",
        type: "text",
        placeholder: "Enter Subpath",
        validation: { required: "Subpath is required" },
    },
    {
        name: "lineIndex",
        label: "Line Index",
        type: "text",
        placeholder: "Enter Lne Index",
        validation: { required: "Line Index is required" },
    },
]