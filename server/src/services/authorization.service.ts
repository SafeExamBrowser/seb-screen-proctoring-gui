import axios from 'axios';
import { Buffer } from 'buffer';


export async function authorizeViaScreenProctoringServer(username: string, password: string): Promise<object>{
    try{

        console.log("test")

        const serverAddress: string = process.env.SERVER_URL + ":" + process.env.SERVER_PORT;
        const url: string =  serverAddress + "/oauth/token?grant_type=password&username=" + username + "&password=" + password;
        
        const encodedCredentials: string = Buffer.from(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64");

        const {data, status} = await axios.post<TokenResponse>(url, {}, {
            headers: {
                "Authorization": "Basic " + encodedCredentials
            }
        });

        console.log(data.access_token)
        console.log(status)

        return data;


    }catch(error){

    }
}