import axios, { AxiosInstance } from "axios";
import * as ENV from "../config/envConfig";
import {Request, Response} from "express";
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

export function getHeadersWithoutAuth(): object {
    return {
        "accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
    };
}

export function handleGenericApiError(error: any, res: Response){

    //if there is an error-response from sp-server
    if(error.response){
        console.error(error.response.status);
        console.error(error.response.data)
        return res.status(error.response.status).json(error.response.data);
    }

    //if there is no response from the sp-server
    if(error.request){
        console.error(500)
        return res.status(500).json("server-error");
    }
    
    //else if there is another type of error
    return res.status(500).send();
}

export function handleGenericApiErrorOld(error: any){

    console.log("teeeeeeeeeeeeest")
        console.log(error)


    LOG.error("====================")
    LOG.error("error message: " + error.message)
    LOG.error("====================")

    if(!error.response){
        throw Error("server error");
    }

    throw Error(error.response.status);
}