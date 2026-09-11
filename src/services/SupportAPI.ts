import { _delete, _get, _post, _put } from "./API";
import { createUrl } from "./helper";
import { ApiPaths } from "../configs/ApiPaths";
import { data } from "react-router-dom";
import { IssuePostModel } from "@/models/apimodels/issue-model";


const SupportAPI = {
    getData: async (path: string, envId: string) => {
        const url = createUrl(
            `${import.meta.env.VITE_DASH_HOST}`,
            ApiPaths[path],
            envId
        );
        return await _get(url);
    },

    getPaginatedData: async (path: string, envId: string, localhost: boolean, pageNumber?: number, pageSize?: number) => {
        const url = createUrl(
            `${!localhost ? import.meta.env.VITE_DASH_HOST : ''}`,
            ApiPaths[path],
            "0",
            "200",
            envId
        );
        return await _get(url);
    },

    createIssue: async (issueData: IssuePostModel) => {
        const url = createUrl(
            `${import.meta.env.VITE_DASH_HOST}`,
            ApiPaths.createIssue,
        );
        return await _post(url, issueData, { observeresponse: true });
    },

    updateIssue: async (issueData: IssuePostModel & { id: string }) => {
        const url = createUrl(
            `${import.meta.env.VITE_DASH_HOST}`,
            ApiPaths.updateIssue,
            issueData.id
        );
        return await _put(url, issueData, { observeresponse: true });
    }
};



export default SupportAPI;
