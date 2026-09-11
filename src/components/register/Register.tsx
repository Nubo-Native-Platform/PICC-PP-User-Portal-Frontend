import { useEffect, useState, useRef } from "react";
import AccountDetailsForm, { AccountDetailsFormHandle, AccountDetailsFormProps } from './AccountDetails';
import SelectPlanForm, { SelectPlanFormHandle, SelectPlanFormProps } from "./SelectPlan";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Alert,
} from '@mui/material';
import PublicSvc from "@/services/PublicSvc";
import ConfirmationForm from "./Confirmation";
import PaymentForm from "./Payment";
import logo from "/logo/logonnp1.png";
import PersonalDetailsForm, { PersonalDetailsFormHandle } from "./PersonalDetails";
import { loaderController } from "@/services/loaderController";


const RegisterComponent = () => {
  // Detect admin free-creation mode from URL: ?admin-create-env=true
  const isAdminFreeMode = new URLSearchParams(window.location.search).get('admin-create-env') === 'true';

  const [accCreated, setAccCreated] = useState(false);
  const [freeEnvCreated, setFreeEnvCreated] = useState(false);
  // Store IDs returned by /register to pass to /register/free/
  const [registeredAccId, setRegisteredAccId] = useState('');
  const [registeredAccName, setRegisteredAccName] = useState('');
  const [registeredBillId, setRegisteredBillId] = useState('');
  const accFormRef = useRef<AccountDetailsFormHandle>(null);
  const personalFormRef = useRef<PersonalDetailsFormHandle>(null);
  const planFormRef = useRef<SelectPlanFormHandle>(null);
  const [accFormData, setAccFormData] = useState({
    accName: '',
    userId: '',
    userEmail: '',
    password: '',
    retypePassword: '',
    countryCode: '',
    orgName: '',
    orgCategory: '',
    platformPourpose: ''
  });
  const [personalFormData, setPersonalFormData] = useState({
    firstName: '',
    lastName: '',
    contactEmail: '',
    contactNumber: '',
    address: '',
  });
  const [planFormData, setPlanFormData] = useState({
    selectedPlan: null,
    hostPlanId: '',
    totalPrice: 0,
    planComps: [],
    planEffDate: new Date((new Date()).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
  }, []);


  const steps = ['Account Details', 'Personal Details', 'Select Plan', 'Confirmation'];

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === 0) {
      if (accFormRef.current?.isValid()) {
        setActiveStep((prev) => prev + 1);
      } else {
        // accFormRef.current?.submit(); // Trigger native validation messages
      }
    } else if (activeStep === 1) {
      if (personalFormRef.current?.isValid()) {
        setActiveStep((prev) => prev + 1);
      } else {
        personalFormRef.current?.submit(); // Trigger native validation messages
      }
    } else if (activeStep === 2) {
      if (planFormRef.current?.isValid()) {
        setActiveStep((prev) => prev + 1);
      } else {
        planFormRef.current?.submit(); // Trigger native validation messages
      }
    } else if (activeStep === 3) {
      // setActiveStep((prev) => prev + 1);
      handleRegister();
    }
  };

  const handleRegister = async () => {
    // Pull out selected plan from formData
    const selectedPlan = planFormData.selectedPlan || {};
    const planComps = Object.values(planFormData.planComps || {})
      .flat()
      .filter((pc: any) => pc.selected);

    const now = new Date().toISOString();

    const registerData = {
      accName: accFormData.accName,
      user: {
        userId: accFormData.userId,
        firstName: personalFormData.firstName,
        lastName: personalFormData.lastName,
        emailId: accFormData.userEmail, // account email
        contactNumber: personalFormData.contactNumber,
        requestDate: now,
        updateDate: now,
        updateComment: "",
        userType: "admin",
        userStatus: "active",
        password: accFormData.password,
      },
      countryCode: accFormData.countryCode,
      orgName: accFormData.orgName,
      orgCatagory: accFormData.orgCategory,
      platformPourpose: accFormData.platformPourpose,

      selectedPlan: {
        hostPlanid: selectedPlan.hostPlanid,
        hostPlanName: selectedPlan.hostPlanName,
        hostNode: selectedPlan.hostNode || "string",
        hostCPU: selectedPlan.hostCPU || "string",
        hostMem: selectedPlan.hostMem || "string",
        hostStorage: selectedPlan.hostStorage || "string",
        compVOV2: planComps.map((pc: any, idx: number) => ({
          compId: pc.compId,
          compName: pc.compName,
          compDesc: pc.compDesc || "string",
          compStatus: pc.compStatus || "active",
          itemSeq: idx,
          selectionType: pc.selectionType,
          baseDayPrice: pc.baseDayPrice || "0",
        })),
      },

      createdDate: now,
      updatedDate: now,
      organization: accFormData.orgName || "MyOrg",
      description: "Org Desc",
      totalMonthlyCost: String(planFormData.totalPrice || 0),
    };

    console.log("Register Data:", registerData);

    const response = await PublicSvc.register(registerData);
    if (response.data && response.data.accId) {
      const { accId, accName, billId } = response.data;
      setRegisteredAccId(accId);
      setRegisteredAccName(accName);
      setRegisteredBillId(billId);
      setAccCreated(true);

      // If admin free mode: immediately trigger free env creation
      if (isAdminFreeMode) {
        loaderController.show();
        try {
          const freeResp = await PublicSvc.registerFree(accId, accName, billId);
          if (freeResp && (freeResp.status === 200 || freeResp.status === 201)) {
            setFreeEnvCreated(true);
          }
        } finally {
          loaderController.hide();
        }
      }
    }
  };


  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const payNow = async () => {
    loaderController.show();
    const response = await PublicSvc.postPayment({ "accountId": accFormData.accName });
    if (response.data && response.data.url) {
      loaderController.hide();
      window.location.replace(response.data.url);
    } else {
      loaderController.hide();
    }
  }

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div className="h-full w-full flex-column">
      <div className="bg-black">
        <p className="text-left text-white pl-4">
          <a href={import.meta.env.VITE_HOME_URL || "/"}>HOME</a>
        </p>
      </div>
      <div className="nnp-logo-panel">
        <img
          src={logo}
          alt="Responsive Image"
        />
      </div>
      <div className="mt-1">
        <h3 className="text-blue-300 text-center">
          <b>Create your NNP Account</b>
        </h3>
        <br></br>
        <p className="text-center">
          You need to register yourself and subscribe to a plan in order to gain access to NNP.<br></br>
          Upon successful payment your Account Activation Request will be generated, and you will get notified by email.<br></br>
          Account should be activated within a working day and you will get notified along with all the required information.<br></br>
        </p>
      </div>
      <div className="flex flex-row justify-center mt-[30px]">
        <div className="w-[100%] max-w-[300px]">
          <Stepper activeStep={activeStep} sx={{ mb: 4 }} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <div className="w-[100%] max-w-[500px]">
          {activeStep === 0 &&
            <AccountDetailsForm ref={accFormRef} formData={accFormData} setFormData={setAccFormData} personalFormData={personalFormData}></AccountDetailsForm>
          }
          {activeStep === 1 &&
            <PersonalDetailsForm ref={personalFormRef} formData={personalFormData} setFormData={setPersonalFormData} accFormData={accFormData}></PersonalDetailsForm>
          }
          {activeStep === 2 &&
            <SelectPlanForm ref={planFormRef} formData={planFormData} setFormData={setPlanFormData}></SelectPlanForm>
          }
          {activeStep === 3 && accFormData && personalFormData && planFormData &&
            <ConfirmationForm
              accFormData={accFormData}
              personalFormData={personalFormData}
              planFormData={planFormData}
            />
          }
          {/* Step Content */}
          {
            <Box sx={{ my: 4, display: "flex", justifyContent: "flex-end" }}>
              <Box sx={{ width: '100%' }}>

                {/* Free env created success banner */}
                {freeEnvCreated && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    ✅ Environment created successfully (zero-cost)! Your account is being provisioned. You will be notified by email.
                  </Alert>
                )}

                {/* Navigation buttons — hidden once acc is created */}
                {!accCreated && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Button variant="contained" onClick={handleNext}>
                      {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
                    </Button>
                  </Box>
                )}

                {/* Normal payment path — only shown when NOT admin free mode */}
                {accCreated && !isAdminFreeMode && !freeEnvCreated && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      disabled={activeStep < 3}
                      onClick={payNow}
                      color="success"
                      variant="contained"
                      sx={{ mr: 1 }}
                    >
                      Pay Now
                    </Button>
                  </Box>
                )}

              </Box>
            </Box>
          }
        </div>
      </div>
    </div>
  );
};

export default RegisterComponent;
