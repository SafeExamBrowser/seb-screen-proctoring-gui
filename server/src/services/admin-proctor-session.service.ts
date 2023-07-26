import axios from "axios";

const proctorControllerUrl: string = "/proctoring";

export async function getSessionBySessionId(token: string, sessionId: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.SERVER_URL + ":" + process.env.SERVER_PORT;
        const url: string =  serverAddress + process.env.DEFAULT_URL + proctorControllerUrl + "/session/" + sessionId;

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const {data, status} = await axios.get(url, {headers});

        return data;

    }catch(error){
        console.error("====================")
        console.error("error message: " + error.message)
        console.error("====================")

        throw Error(error.response.status);
    }
}


export async function getSessionByTimestamp(token: string, sessionId: string, timestamp: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.SERVER_URL + ":" + process.env.SERVER_PORT;
        const url: string =  serverAddress + process.env.DEFAULT_URL + proctorControllerUrl + "/session/" + sessionId + "/" + timestamp;

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };


        const {data, status} = await axios.get(url, {headers: headers});

        // console.log("====================")
        // console.log("http status: " + status)
        // console.log("jwt token: " + data.access_token)
        // console.log("====================")

        return data;

    }catch(error){
        console.error("====================")
        console.error("error message: " + error.message)
        console.error("====================")

        throw Error(error.response.status);
    }
}