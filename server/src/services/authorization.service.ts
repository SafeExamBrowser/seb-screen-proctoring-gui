import axios from 'axios';
import {Buffer} from 'buffer';
import {LOG} from '../logging/logger';
import * as ENV from "../config/envConfig";


export async function authorizeViaScreenProctoringServer(username: string, password: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + "/oauth/token?grant_type=password&username=" + username + "&password=" + password;
        const encodedCredentials: string = Buffer.from(ENV.USERNAME + ":" + ENV.PASSWORD).toString("base64");

        const {data, status} = await axios.post(url, {}, {
            headers: {
                "Authorization": "Basic " + encodedCredentials
            }
        });

        return data;

    }catch(error){
        LOG.error("====================")
        LOG.error("error message: " + error)
        LOG.error("====================")

        if(!error.response){
            throw Error("server error");
        }

        throw Error(error.response.status);
    }
}

export async function refreshViaScreenProctoringServer(refreshToken: string): Promise<object>{
    try{
        const serverAddress: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + "/oauth/token?grant_type=refresh_token&client_id=" + ENV.USERNAME + "&refresh_token=" + refreshToken;
        
        const encodedCredentials: string = Buffer.from(ENV.USERNAME + ":" + ENV.PASSWORD).toString("base64");

        const {data, status} = await axios.post(url, {}, {
            headers: {
                "Authorization": "Basic " + encodedCredentials
            }
        });

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