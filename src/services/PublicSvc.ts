import axios from "axios";
import { createUrl } from "./helper";
import { _delete, _get, _post, _put } from "./API";

import { ApiPaths } from "../configs/ApiPaths";

export const PublicSvc = {
  getContries: async () => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT_PUB}`, ApiPaths.getCountries);
    return await _get(url);

  },
  getOrgCategories: async () => {
    const url = createUrl(`${import.meta.env.VITE_APP_DOMAIN}`, ApiPaths.getOrgCategories);
    return await _get(url);
  },
  getPlans: async () => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT_PUB}`, ApiPaths.getPlans);
    return await _get(url);
  },
  getPlanComp: async (planId: string) => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT_PUB}`, ApiPaths.getPlanComp, planId);
    return await _get(url);
  },
  userExist: async (userId: string) => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT_PUB}`, ApiPaths.userExist, userId);
    return await _get(url);
  },
  accExist: async (account: string) => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT_PUB}`, ApiPaths.accExist, account);
    return await _get(url);
  },
  userEmailExists: async (email: string) => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT_PUB}`, ApiPaths.userEmailExists, email);
    return await _get(url);
  },
  checkExistsAllSystems: async (userIdentifier: string, envId: string) => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT}`, ApiPaths.checkExistsAllSystems, userIdentifier, envId);
    return await _get(url);
  },

  register: async (registerData: any) => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT_PUB}`, ApiPaths.register);
    return await _post(url, registerData, { observeresponse: true });
  },

  // Free (zero-cost / admin) env creation — called when ?admin-create-env=true
  registerFree: async (accId: string, accName: string, billId: string) => {
    const url = createUrl(`${import.meta.env.VITE_NNP_CONFT}`, ApiPaths.registerFree);
    const now = new Date().toISOString();
    const payload = {
      accId,
      accName,
      accBillId: billId,
      payDt: now,
      payAmount: 0,
      payMode: "FREE",
      payRef: "admin-free",
      paymentNotes: "Admin created free environment",
      isPaymentSuccess: true,
    };
    return await _post(url, payload, { observeresponse: true });
  },

  postPayment: async (paymentData: any) => {
    const url = createUrl(`${import.meta.env.VITE_API_PAYMENT}`, ApiPaths.payment);
    return await _post(url, paymentData, { observeresponse: true });
  },

  getStatus: async () => {
    const url = createUrl(`${import.meta.env.VITE_APP_DOMAIN}`, ApiPaths.getStatus);
    return await _get(url);
  },


};

export default PublicSvc;
