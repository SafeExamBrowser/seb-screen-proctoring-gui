import axios from 'axios';
import {Buffer} from 'buffer';
import * as ENV from "../config/envConfig";
import * as apiService from "../services/api.service";

const tokenUrl: string = ENV.PROCTOR_SERVER_URL + ENV.PROCTOR_SERVER_PORT + "/oauth/token?grant_type=";

export async function authorizeViaScreenProctoringServer(username: string, password: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const url: string = tokenUrl + "password&username=" + username + "&password=" + password;
        const encodedCredentials: string = createEncodedCredentials(ENV.USERNAME, ENV.PASSWORD);

        const {data, status} = await axios.post(url, {}, {
            headers: apiService.getAuthorizationHeaders(encodedCredentials)
        });

        return data;

    }catch(error){
        apiService.handleGenericApiErrorOld(error);
    }
}

export async function refreshViaScreenProctoringServer(refreshToken: string): Promise<object>{
    try{
        const url: string = tokenUrl + "refresh_token&client_id=" + ENV.USERNAME + "&refresh_token=" + refreshToken;
        const encodedCredentials: string = createEncodedCredentials(ENV.USERNAME, ENV.PASSWORD);

        const {data, status} = await axios.post(url, {}, {
            headers: apiService.getAuthorizationHeaders(encodedCredentials)
        });

        return data;

    }catch(error){
        apiService.handleGenericApiErrorOld(error);
    }
}

function createEncodedCredentials(username: string, password: string): string{
    return Buffer.from(username + ":" + password).toString("base64");
}