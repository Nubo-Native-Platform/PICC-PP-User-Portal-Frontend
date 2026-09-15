import axios from "axios";
import { MessageService } from "./helper";
import { showConfirmDialog } from "../sharedComponents/ConfirmDialog";
import { loaderController } from "@/services/loaderController";
import CookieService from "./cookies";

const config = {
  headers: {},
  credentials: "include",
};

const safeRequest = async <T>(requestFn: () => Promise<T>): Promise<T | null> => {
  try {
    const response = await requestFn();
    return response;
  } catch (error) {
    // The interceptor will show popup — so no need to duplicate that here
    console.error("API Error:", error);
    return null; // return null instead of throwing error
  }
};

export const _get = async (url: string) =>
  safeRequest(async () => {
    const response = await axios.get(url, { withCredentials: true });
    return response?.data;
  });

export const _post = async (
  url: string,
  data: unknown,
  options: { observeresponse: boolean }
) =>
  safeRequest(async () => {
    const response = await axios.post(url, data, config);
    return options.observeresponse ? response : response?.data;
  });

export const _put = async (url: string, data: unknown, options: { observeresponse: boolean }) =>
  safeRequest(async () => {
    const response = await axios.put(url, data, config);
    return options.observeresponse ? response : response?.data;
  });

export const _patch = async (url: string, data?: unknown) =>
  safeRequest(async () => {
    const response = await axios.patch(url, data, config);
    return response?.data;
  });

export const _delete = async (url: string, options: { observeresponse: boolean }) =>
  safeRequest(async () => {
    const response = await axios.delete(url);
    return options.observeresponse ? response : response?.data;
  });

// export const appLogout = () => {
//   localStorage.clear();
// };

export const _concurrentRequest = async (requestList: unknown[]) => {
  try {
    const response = await axios.all(requestList);
    return response;
  } catch (err) {
    console.error("Concurrent API Error:", err);
    return [];
  }
};

axios.interceptors.request.use(
  (config) => {
    // ✅ Show loader when any API starts
    loaderController.show();

    // Keep your existing logic untouched
    MessageService.setLoading(true);

    return config;
  },
  (error) => {
    loaderController.hide();
    MessageService.setLoading(false);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  async (response) => {
    // ✅ Hide loader on success
    loaderController.hide();
    MessageService.setLoading(false);

    return response;
  },
  async (error) => {
    // ✅ Hide loader on error also
    loaderController.hide();
    MessageService.setLoading(false);

    const status = error.response?.status;
    const redirectUrl = error.response?.headers?.location;
    const backendMessage = error.response?.data?.message || "";

    // ✅ NEW: handle backend 307 redirect
    if (status === 307 && redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }

    // ✅ Existing Error Handling
    if (status === 401) {
      const currentDomain = window.location.origin;
      const currentUrl = window.location.href;
      let message = error.response?.data?.message || "";
      if (message === "User does not belong to the selected env") {
        message = "User does not belong to the selected env";
      } else if (
        message.includes("Invalid user credentials") ||
        message.includes("invalid_grant")
      ) {
        message = "Invalid credentials!";
      }
      else {
        message = "Session expired! Please login again.";
      }


      showConfirmDialog({
        type: "error",
        message: message,
        confirmText: "OK",
        onConfirm: () => {
          CookieService.clearCookies();
          window.location.href = `${currentDomain}/nnp-login/?continue=${currentUrl}`;
        }
      });
    } else if (status >= 400 && status < 500) {
      showConfirmDialog({
        type: "error",
        message: backendMessage || "Some error occurred",
        confirmText: "OK",
      });

    } else {
      showConfirmDialog({
        type: "error",
        message: backendMessage || "Unexpected Error",
        confirmText: "OK",
      });
    }

    return Promise.reject(error);
  }
);

