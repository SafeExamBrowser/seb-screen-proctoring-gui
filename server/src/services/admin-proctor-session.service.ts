import axios from "axios";
import {LOG} from '../logging/logger';
import * as ENV from "../config/envConfig";

const proctorControllerUrl: string = "/proctoring";

export async function getSessionBySessionId(token: string, sessionId: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + ENV.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/session/" + sessionId;

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const {data, status} = await axios.get(url, {headers});

        return data;

    }catch(error){
        LOG.error("====================")
        LOG.error("error message: " + error.message)
        LOG.error("====================")

        if(!error.response){
            throw Error("server error");
        }

        throw Error(error.response.status);
    }
}


export async function getSessionByTimestamp(token: string, sessionId: string, timestamp: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + ENV.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/session/" + sessionId + "/" + timestamp;

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const {data, status} = await axios.get(url, {headers: headers});

        return data;

    }catch(error){
        LOG.error("====================")
        LOG.error("error message: " + error.message)
        LOG.error("====================")

        if(!error.response){
            throw Error("server error");
        }

        throw Error(error.response.status);
    }
}