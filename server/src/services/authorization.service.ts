import axios from 'axios';
import { Buffer } from 'buffer';


export async function authorizeViaScreenProctoringServer(username: string, password: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.SERVER_URL + ":" + process.env.SERVER_PORT;
        const url: string =  serverAddress + "/oauth/token?grant_type=password&username=" + username + "&password=" + password;
        
        const encodedCredentials: string = Buffer.from(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64");

        //todo: check if tokenresponse is necessary
        const {data, status} = await axios.post<TokenResponse>(url, {}, {
            headers: {
                "Authorization": "Basic " + encodedCredentials
            }
        });

        console.log("====================")
        console.log("http status: " + status)
        console.log("jwt token: " + data.access_token)
        console.log("====================")

        return data;

    }catch(error){
        console.log("====================")
        console.error("error message: " + error.message)
        console.log("====================")

        throw Error(error);
    }
}