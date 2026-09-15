import { _delete, _get, _post, _put } from "./API";
import { createUrl } from "./helper";

import { ApiPaths } from "../configs/ApiPaths";
import { serviceMap } from "@/configs/serviceMap";


const CommonAPI = {
    getDropdownOptions: async (path: string, service?) => {
        const url = createUrl(
            `${service ? serviceMap[service] : import.meta.env.VITE_APP_DOMAIN}`,
            ApiPaths[path]
        );
        return await _get(url);
    }
};



export default CommonAPI;
