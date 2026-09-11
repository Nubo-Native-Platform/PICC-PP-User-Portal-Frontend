import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { MessageService } from "./message";
import AuthAPI from "./AuthAPI";

export const setupAxiosInterceptors = () => {
  // axios.interceptors.response.use(
  //   async (response) => {
  //     // Stop loader when request succeeds
  //     MessageService.setLoading(false);
  //     return response;
  //   },
  //   async (error) => {
  //     MessageService.setLoading(false);

  //     // Extract message safely from backend response
  //     const backendMessage =
  //       error?.response?.data?.message ||
  //       error?.response?.data?.error ||
  //       error?.message ||
  //       "Something went wrong. Please try again.";

  //     // Handle different HTTP status codes
  //     if (error.response) {
  //       const status = error.response.status;

  //       switch (status) {
  //         case 400:
  //           MessageService.setStatus({ type: "error", text: backendMessage });
  //           break;

  //         case 401:
  //           MessageService.setStatus({
  //             type: "error",
  //             text: backendMessage || "Unauthorized. Please login again.",
  //           });

  //           // Optionally logout or redirect
  //           setTimeout(() => {
  //             AuthAPI.logout();
  //             window.location.href = "/login";
  //           }, 1000);
  //           break;

  //         case 403:
  //           MessageService.setStatus({
  //             type: "error",
  //             text: "Access denied. You do not have permission.",
  //           });
  //           break;

  //         case 404:
  //           MessageService.setStatus({
  //             type: "error",
  //             text: "Requested resource not found.",
  //           });
  //           break;

  //         case 500:
  //           MessageService.setStatus({
  //             type: "error",
  //             text: backendMessage || "Internal Server Error",
  //           });
  //           break;

  //         default:
  //           MessageService.setStatus({
  //             type: "error",
  //             text: backendMessage,
  //           });
  //       }

  //       // Reject promise so calling function can handle it if needed
  //       return Promise.reject(error);
  //     } else {
  //       // Network error or server not reachable
  //       MessageService.setStatus({
  //         type: "error",
  //         text: "Network error. Please check your connection.",
  //       });

  //       return Promise.reject(error);
  //     }
  //   }
  // );

  axios.interceptors.response.use((response) => {
    return response;
  }, function (error) {
    // Do something with response error
    console.log('interceptor error', error);
    if (error.response.status === 401) {
      console.log('unauthorized, logging out ...');
      // auth.logout();
      // router.replace('/auth/login');
    }
    return Promise.reject(error.response);
  });
};
