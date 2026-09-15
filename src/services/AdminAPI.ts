import { _delete, _get, _post, _put } from "./API";
import { createUrl } from "./helper";

import { ApiPaths } from "../configs/ApiPaths";
import { serviceMap } from "@/configs/serviceMap";


const AdminAPI = {
  getData: async (path: string, envId: string, localhost: boolean, service?) => {
    const url = createUrl(
      `${!localhost ? (service ? serviceMap[service] : import.meta.env.VITE_DASH_HOST) : ''}`,
      ApiPaths[path],
      envId
    );
    return await _get(url);
  },

  getLast24Log: async () => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.getLast24Log
    );
    return await _get(url);
  },

  postUserData: async (path: string, data: unknown, envId: string, localhost: boolean,) => {
    const url = createUrl(
      `${!localhost ? import.meta.env.VITE_NNP_CONFT : ''}`,
      ApiPaths[path],
      envId
    );
    return await _post(url, data, { observeresponse: true });
  },

  checkExistsAllSystems: async (userIdentifier: string, envId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_NNP_CONFT}`,
      ApiPaths.checkExistsAllSystems,
      userIdentifier,
      envId
    );
    return await _get(url);
  },

  putUserData: async (path: string, data: unknown) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths[path]
    );
    return await _put(url, data, { observeresponse: true });
  },

  getPlanComponents: async (planId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_NNP_CONFT}`,
      ApiPaths.getPlanComp,
      planId
    );
    return await _get(url);
  },

  getEnvFeaturesByUserRole: async (envId: string, userRoleId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_NNP_CONFT}`,
      ApiPaths.getEnvFeatureAccess,
      envId,
      userRoleId
    );
    return await _get(url);
  },

  updateUserAccess: async (envId: string, userId: string, features: any) => {
    const url = createUrl(
      `${import.meta.env.VITE_NNP_CONFT}`,
      ApiPaths.updateUserAccess,
      envId,
      userId
    );
    return await _put(url, features, { observeresponse: true });
  },

  getUserRoles: async () => {
    const url = createUrl(
      `${import.meta.env.VITE_NNP_CONFT}`,
      ApiPaths.getUserRole
    );
    return await _get(url);
  },

  getKubernetesDetails: async (envId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_API_KI}`,
      ApiPaths.getK8sDetails,
      envId
    );
    return await _get(url);
  },

  restartPod: async (envId: string, podName: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_API_KI}`,
      ApiPaths.restartPod,
      envId,
      podName
    );
    return await _delete(url, { observeresponse: true });
  },

  getAccountDetails: async (envId: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.getAccountDetails,
      envId
    );
    return await _get(url);
  },

  putAccountDetails: async (envId: string, data: any) => {
    const url = createUrl(
      `${import.meta.env.VITE_DASH_HOST}`,
      ApiPaths.putAccountDetails,
      envId
    );
    return await _put(url, data, { observeresponse: true });
  },

  getK8sIntgResources: async (envId: string, deploymentName: string) => {
    const url = createUrl(
      `${import.meta.env.VITE_API_KI}`,
      ApiPaths.k8IntgResources,
      deploymentName,
      envId
    );
    return await _get(url);
  },

  deletePod: async (data: any) => {
    const url = createUrl(
      `${import.meta.env.VITE_API_KI}`,
      ApiPaths.deleteResources
    );
    return await _post(url, data, { observeresponse: true });
  },

  openKubernetesTerminal: async (data) => {
    const url = createUrl(
      `${import.meta.env.VITE_API_KI_PUB}`,
      ApiPaths.openKubernetesTerminal,
    );
    return await _post(url, data, { observeresponse: true });
  }
}

export default AdminAPI;
