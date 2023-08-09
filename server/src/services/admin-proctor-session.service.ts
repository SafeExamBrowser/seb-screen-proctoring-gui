import axios from "axios";
import {LOG} from '../logging/logger';

const proctorControllerUrl: string = "/proctoring";

export async function getSessionBySessionId(token: string, sessionId: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.PROCTOR_SERVER_URL + ":" + process.env.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + process.env.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/session/" + sessionId;

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
        const serverAddress: string = process.env.PROCTOR_SERVER_URL + ":" + process.env.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + process.env.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/session/" + sessionId + "/" + timestamp;

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