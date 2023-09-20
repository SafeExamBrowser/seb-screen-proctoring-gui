import axios, { AxiosInstance } from "axios";
import * as ENV from "../config/envConfig";
import {LOG} from '../logging/logger';

export const api: AxiosInstance = axios.create({
    baseURL: ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT + ENV.PROCTOR_DEFAULT_URL,
});

export function getAuthorizationHeaders(encodedCredentials: string): object {
    return {
        "Authorization": "Basic " + encodedCredentials
    };
}

export function getHeaders(token: string): object {
    return {
        "accept": "application/json",
        "Authorization": token,
        "Content-Type": "application/x-www-form-urlencoded"
    };
}

export function handleGenericApiError(error: any){
    LOG.error("====================")
    LOG.error("error message: " + error.message)
    LOG.error("====================")

    if(!error.response){
        throw Error("server error");
    }

    throw Error(error.response.status);
}