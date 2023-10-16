import axios from "axios";
import * as apiService from "../services/api.service";

const sessionUrl: string = "/proctoring/session/";

export async function getSessionBySessionId(token: string, sessionId: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const url: string = sessionUrl + sessionId;
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

        return data;

    }catch(error){
        apiService.handleGenericApiError(error);
    }
}


export async function getSessionByTimestamp(token: string, sessionId: string, timestamp: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const url: string =  sessionUrl + sessionId + "/" + timestamp;
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

        return data;

    }catch(error){
        apiService.handleGenericApiError(error);
    }
}