import AccountDetailsBillingFormComponent from "@/components/account/AccountDetailsBillingFormComponent";
import AccountDetailsPersonalFormComponent from "@/components/account/AccountDetailsPersonalFormComponent";
import ChangePlanDataContainer from "@/components/register/ChangePlanDataContainer";

export const REGISTER_USER_FORM_CONFIG = [
    {
        id: "accDetails",
        label: "Account Details",
        element: AccountDetailsPersonalFormComponent,
    },
    // {
    //     id: "billingDetails",
    //     label: "Billing Details",
    //     element: AccountDetailsBillingFormComponent,
    // },
    {
        id: "plan",
        label: "Select Plan",
        element: ChangePlanDataContainer
    }
];