import { _delete, _get, _post, _put } from "./API";
import { createUrl } from "./helper";

import { ApiPaths } from "../configs/ApiPaths";
import { LoginCred } from "../models/apimodels/login-cred";
import CookieService from "./cookies";

export const AuthAPI = {
  login: async (credential: LoginCred) => {
    const url = createUrl(`${import.meta.env.VITE_AUTH_HOST}`, ApiPaths.login);
    return await _post(url, credential, { observeresponse: true });
  },

  logout: () => {
    const url = createUrl(`${import.meta.env.VITE_AUTH_HOST}`, ApiPaths.logout);
    const data = {
      accessToken: CookieService.getToken(),
      refreshToken: CookieService.getRefreshToken()
    }
    return _post(url, data, { observeresponse: false });
  },

  getAccDetailsWithCountry: async (envId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.getAccWithCountry,
      envId
    );
    return await _get(url);
  }
};

export default AuthAPI;
