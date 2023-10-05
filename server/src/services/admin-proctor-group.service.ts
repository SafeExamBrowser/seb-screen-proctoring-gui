import axios, {AxiosHeaders} from "axios";
import {LOG} from '../logging/logger';
import * as ENV from "../config/envConfig";
import * as apiService from "../services/api.service";


const groupUrl: string = "/proctoring/group";

export async function getGroups(token: string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const url: string =  groupUrl;
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

        return data;

    }catch(error){
        apiService.handleGenericApiError(error);
    }
}


export async function getGroupByUuid(token: string, uuid: string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const url: string =  groupUrl + "/" + uuid;
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

        return data;

    }catch(error){
        apiService.handleGenericApiError(error);
    }
}