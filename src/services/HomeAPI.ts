import { _delete, _get, _post, _put } from "./API";
import { createUrl } from "./helper";
import { ApiPaths } from "../configs/ApiPaths";
import { Feature } from "../models/apimodels/feature";
import { DashboardOptions } from "@/models/dashboardOptions";
import { ProxyConfigModel } from "@/models/apimodels/proxy-config-model";

const HomeAPI = {
  getUsers: async (envId: string) => {
    const url = createUrl(`${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.getUsers,
      envId);
    return await _get(url);
  },

  getUserDetails: async (userId: string) => {
    const url = createUrl(`${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.getUserDetails,
      userId);
    return await _get(url);
  },

  getFeatures: async (envId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.getFeatures,
      envId
    );
    return await _get(url);
  },

  getFeatureElementDataForkJoin: async (instanceMenuData: Feature[]) => {
    const requests = instanceMenuData.map((item) => {
      const url = createUrl(
        `${import.meta.env.VITE_DASH_HOST}`,
        ApiPaths.getFeatureElements,
        item.feaId
      );
      return _get(url);
    });

    try {
      const results = await Promise.all(requests); // Wait for all calls
      return results; // Returns an array of responses
    } catch (error) {
      console.error("Error fetching feature elements:", error);
      return []; // Return empty array on failure
    }
  },

  getData: async (path: string, elementId: string, userId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths[path],
      elementId,
      userId
    );
    return await _get(url);
  },

  getDetails: async (link: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      link
    );
    return await _get(url);
  },

  getElementDetailsForkJoin: async (baseData: DashboardOptions[], username: string) => {
    const requests = baseData.map((item) => {
      const url = createUrl(
        `${import.meta.env.VITE_DASH_HOST}`,
        ApiPaths.getChildElements,
        item.id,
        username
      );
      return _get(url);
    });

    try {
      const results = await Promise.all(requests); // Wait for all calls
      return results; // Returns an array of responses
    } catch (error) {
      console.error("Error fetching feature elements:", error);
      return []; // Return empty array on failure
    }
  },
  addProxyConfig: async (data: ProxyConfigModel) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.addProxyConfig,
    );
    return await _post(url, data, { observeresponse: true });
  },
  updateProxyConfig: async (data: ProxyConfigModel, envConfigId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.updateProxyConfig,
      envConfigId
    );
    return await _put(url, data, { observeresponse: true });
  },
  deleteProxyConfig: async ( envConfigId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.deleteProxyConfig,
      envConfigId
    );
    return await _delete(url, { observeresponse: true });
  },
  getAllProxyConfig: async () => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.getProxyConfig,
    );
    return await _get(url);
  },
}

export default HomeAPI;
