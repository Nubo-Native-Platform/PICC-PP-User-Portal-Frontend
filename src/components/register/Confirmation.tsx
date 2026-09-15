import React from "react";

type ConfirmationFormProps = {
  accFormData: any;
  personalFormData: any;
  planFormData: any;
};

const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
  accFormData,
  personalFormData,
  planFormData,
}) => {
  const { selectedPlan, totalPrice } = planFormData;

  return (
    <div className="body-font">

      <div className="mb-4">
        <div className="font-[var(--font-bold)] nnp-border-bottom pb-1 mb-2">Plan Details</div>
        <div className="flex-space-center"><span>Selected Plan :</span> <span className="font-[var(--font-semibold)]">{selectedPlan?.hostPlanName}</span></div>
        <div className="flex-space-center"><span>Monthly Cost :</span> <span className="font-[var(--font-semibold)]">${totalPrice}</span></div>
        <div className="flex-space-center"><span>Effective From :</span> <span className="font-[var(--font-semibold)]">{planFormData.planEffDate}</span></div>
      </div>

      <div className="mb-4">
        <div className="font-[var(--font-bold)] nnp-border-bottom pb-1 mb-2">Personal Details</div>
        <div className="flex-space-center"><span>Name :</span> <span className="font-[var(--font-semibold)]">{personalFormData.firstName} {personalFormData.lastName}</span></div>
        <div className="flex-space-center"><span>Email :</span> <span className="font-[var(--font-semibold)]">{personalFormData.contactEmail}</span></div>
        <div className="flex-space-center"><span>Contact :</span> <span className="font-[var(--font-semibold)]">{personalFormData.contactNumber}</span></div>
      </div>

      <div className="mb-4">
        <div className="font-[var(--font-bold)] nnp-border-bottom pb-1 mb-2">Account Details</div>
        <div className="flex-space-center"><span>Account Name :</span> <span className="font-[var(--font-semibold)]">{accFormData.accName}</span></div>
        <div className="flex-space-center"><span>User ID :</span> <span className="font-[var(--font-semibold)]">{accFormData.userId}</span></div>
        <div className="flex-space-center"><span>User Mail :</span> <span className="font-[var(--font-semibold)]">{accFormData.userEmail}</span></div>
      </div>

    </div>
  );
};

export default ConfirmationForm;
