import * as ENV from "../config/envConfig";
import * as apiService from "./api.service";
import axios from "axios";
import * as utils from "../utils/utils";


//does not use the pre-configured api-serice --> calls an unprotected api on the sp-server
const unprotectedUrl = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;

export async function registerUserAccount(userData: {}): Promise<object>{
    const encodedCredentials: string = utils.createEncodedCredentials(ENV.PROCTOR_SERVER_USERNAME, ENV.PROCTOR_SERVER_PASSWORD);
    const url = unprotectedUrl + "/register";

    const {data, status} = await axios.post(url, userData, {headers: apiService.getAuthorizationHeadersBasic(encodedCredentials)});

    return data;
}
//-----------------------------------------------------------------------//

const userAccountUrl: string = "/useraccount";

export async function getPersonalUserAccount(token: string){
    const url: string = userAccountUrl + "/me";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return data;
}

export async function getUserAccountById(token: string, accountId: string){
    const url: string = userAccountUrl + "/" + accountId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return data;
}

export async function getUserAccounts(token: string, options?: {}): Promise<object>{
    const url: string = userAccountUrl;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return data;
}

export async function activateUserAccount(token: string, accountId: string){
    const url: string = userAccountUrl + "/" + accountId + "/active";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return data;
}

export async function deactivateUserAccount(token: string, accountId: string){
    const url: string = userAccountUrl + "/" + accountId + "/inactive";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return data;
}