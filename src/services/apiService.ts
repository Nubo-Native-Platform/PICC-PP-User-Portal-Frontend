// src/services/httpClient.ts
// import { getAuthToken } from '../utils/auth';

// import { getEnvCode, getXuserType } from "../shared/utils";
import CookieService from "../services/cookies";


const buildHeaders = (customHeaders: HeadersInit = {}): HeadersInit => {
    //   const token = getAuthToken();
    const token = null

    return {
        'Content-Type': 'application/json',
        'X-Env-Code': CookieService.getEnvId(),
        'X-User-Type': CookieService.getUserType(), //'superAdmin',
        ...customHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async <T = any>(response: Response): Promise<T> => {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    // Try to parse JSON safely, otherwise fall back to text
    let data: any = null;
    try {
        data = isJson ? await response.json() : await response.text();
    } catch {
        data = null;
    }

    if (!response.ok) {
        if (response.status === 401) {
            const currentDomain = window.location.origin;
            const currentUrl = window.location.href;
            console.log(
                "Redirecting to login page:",
                `${currentDomain}/nnp-login/continue=${currentUrl}`
            );
            window.location.href = `${currentDomain}/nnp-login/continue=${currentUrl}`;
        }

        // Build better error message
        const message =
            (typeof data === "object" && data?.message) ||
            (typeof data === "string" && data) ||
            response.statusText ||
            `Request failed with status ${response.status}`;

        const error: any = new Error(message);
        error.status = response.status;
        error.body = data;
        throw error;
    }

    return data as T;
};


const ApiService = {
    get: async <T = any>(url: string, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: buildHeaders(headers),
        });
        return handleResponse(response);
    },

    post: async <T = any>(url: string, body: any, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${url}`, {
            method: 'POST',
            headers: buildHeaders(headers),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    put: async <T = any>(url: string, body: any, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${url}`, {
            method: 'PUT',
            headers: buildHeaders(headers),
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async <T = any>(url: string, headers?: HeadersInit): Promise<T> => {
        const response = await fetch(`${url}`, {
            method: 'DELETE',
            headers: buildHeaders(headers),
        });
        return handleResponse(response);
    },
};

export default ApiService;