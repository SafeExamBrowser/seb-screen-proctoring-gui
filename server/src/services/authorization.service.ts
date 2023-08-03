import axios from 'axios';
import { Buffer } from 'buffer';


export async function authorizeViaScreenProctoringServer(username: string, password: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.PROCTOR_SERVER_URL + ":" + process.env.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + "/oauth/token?grant_type=password&username=" + username + "&password=" + password;

        console.log("url: " + url)
        
        const encodedCredentials: string = Buffer.from(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64");

        //todo: check if tokenresponse is necessary
        const {data, status} = await axios.post(url, {}, {
            headers: {
                "Authorization": "Basic " + encodedCredentials
            }
        });

        return data;

    }catch(error){
        console.error("====================")
        console.error("error message: " + error)
        console.error("====================")

        if(!error.response){
            throw Error("server error");
        }

        throw Error(error.response.status);
    }
}

export async function refreshViaScreenProctoringServer(refreshToken: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        //http://localhost:8090/oauth/token?grant_type=refresh_token&client_id=sebserver&refresh_token=
        const serverAddress: string = process.env.PROCTOR_SERVER_URL + ":" + process.env.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + "/oauth/token?grant_type=refresh_token&client_id=" + process.env.USERNAME + "&refresh_token=" + refreshToken;
        
        const encodedCredentials: string = Buffer.from(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64");

        //todo: check if tokenresponse is necessary
        const {data, status} = await axios.post(url, {}, {
            headers: {
                "Authorization": "Basic " + encodedCredentials
            }
        });

        return data;

    }catch(error){
        console.error("====================")
        console.error("error message: " + error.message)
        console.error("====================")

        if(!error.response){
            throw Error("server error");
        }

        throw Error(error.response.status);
    }
}