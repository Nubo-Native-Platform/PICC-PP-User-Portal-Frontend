import { useEffect, useState } from "react";
import CookieService from "../services/cookies";
import CustomModal from "../sharedComponents/CustomModal";
import { AuthAPI } from "../services/AuthAPI";
import { Env, LoginCred } from "../models/apimodels/login-cred";
import { LOGIN_FORM_CONFIG } from "@/configs/FormConfig";
import FormComponent from "@/sharedComponents/FormComponent";
import { FieldConfig } from "@/models/formModel";
import { useNavigate } from 'react-router-dom';
import { showConfirmDialog } from "@/sharedComponents/ConfirmDialog";
const environments = [
  { envId: "", envTenantId: "" },
];

const LoginModal = ({
  open,
  onClose,
  onRegisterOpen,
}: {
  open: boolean;
  onClose: () => void;
  onRegisterOpen: () => void;
}) => {
  const [loginFormFields, setLoginFormFields] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loginFormFields: FieldConfig[] = JSON.parse(JSON.stringify(LOGIN_FORM_CONFIG));

    // Assign methods to respective buttons
    loginFormFields.find(f => f.name === "loginBtn")!.value = (fields) => handleLogin(fields);
    loginFormFields.find(f => f.name === "forgotPasswordBtn")!.value = (fields) => handleForgotPassword();

    setLoginFormFields(loginFormFields);
  }, []);


  const handleLogin = async (formFields: FieldConfig[]) => {
    if (formFields[0]?.value && formFields[1]?.value && formFields[2]?.value) {
      const env: Env | undefined = { envId: formFields[0].value, envTenantId: 'devops' };
      const credential: LoginCred = {
        username: formFields[1].value,
        password: formFields[2].value,
        envId: formFields[0].value,
        env: env,
      };
      const response = await AuthAPI.login(credential);
      if (response) {
        CookieService.allowCookies();
        CookieService.setToken(response.headers.get("nnp-token"));
        CookieService.setRefreshToken(response.headers.get("nnp-refresh-token"));
        CookieService.setUsername(formFields[1].value);
        CookieService.setEnv(env);
        CookieService.setUserType(response.data.userType);
        // CookieService.setLocalstorageLoggedIn(true);
        window.dispatchEvent(new Event("storage"));
        onClose();
        getAccDetailsWithCountry();
        // window.location.reload();
      }
    } else {
      // alert("Please enter username and password");
      showConfirmDialog({
        type: "info",
        message: "Please enter username and password",
        confirmText: "OK",
      });
    }
  };

  const getAccDetailsWithCountry = async () => {
    const res = await AuthAPI.getAccDetailsWithCountry(CookieService.getEnvId() || "");
    if (res && res.length) {
      const acc = res[0];
      const country = acc.nnpCountry;
      CookieService.setCountry(country || "US");
    }
  };

  const handleForgotPassword = () => {
    const resetUrl =
      import.meta.env.VITE_KEYCLOAK_RESET_CREDENTIALS_URL ||
      "https://keycloak.example.com/comm/auth/realms/devops/login-actions/reset-credentials";
    window.open(resetUrl, "_blank", "noopener,noreferrer");
  };

  const handleRegister = () => {
    navigate('/register');
  };

  if (!open) return null;

  return (
    <CustomModal
      modalClassName="login-modal"
      headerText="Login to NNP"
      footerText={
        <>
          Login is for registered users only. <br />
          If you do not have a user ID, please register yourself first.
        </>
      }
    >
      <div className="p-[var(--nnp-padding-medium)] nnp-modal-body bg-[var(--base-color-primary)]">
        <FormComponent fields={loginFormFields} onChange={() => { console.log('login input change') }} />
      </div>
    </CustomModal>
  );
};
export default LoginModal;
