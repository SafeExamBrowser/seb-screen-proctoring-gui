import * as ENV from "../config/envConfig";
import * as apiService from "../services/api.service";
import axios from "axios";

//does not use the pre-configured api-serice --> calls an unprotected api on the sp-server
const unprotectedUrl = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;

export async function registerUserAccount(userData: {}): Promise<object>{
    const url = unprotectedUrl + "/register";
    const {data, status} = await axios.post(url, userData, {headers: apiService.getHeadersWithoutAuth()});

    return data;
}

//-----------------------------------------------------------------------//
const userAccountUrl: string = "/useraccount";

export async function getPersonalUserAccount(token: string){
    const url: string = userAccountUrl + "/me";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return data;
}