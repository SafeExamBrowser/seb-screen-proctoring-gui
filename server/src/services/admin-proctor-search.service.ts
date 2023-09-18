import axios from "axios";
import {LOG} from '../logging/logger';
import * as ENV from "../config/envConfig";

const proctorControllerUrl: string = "/proctoring";

export async function searchSessions(token: string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + ENV.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/search/sessions";

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const {data, status} = await axios.get(url, {headers: headers, params: options});

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


export async function searchScreenshots(token: string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + ENV.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/search/screenshots";

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const {data, status} = await axios.get(url, {headers: headers, params: options});

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