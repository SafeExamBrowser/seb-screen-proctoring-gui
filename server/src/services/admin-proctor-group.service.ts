import axios from "axios";

const proctorControllerUrl: string = "/proctoring";

export async function getGroups(token: string, pageNumber?: number, pageSize?: number, filterCriteria?: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.SERVER_URL + ":" + process.env.SERVER_PORT;
        const url: string =  serverAddress + process.env.DEFAULT_URL + proctorControllerUrl + "/group";

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const {data, status} = await axios.get(url, { headers });

        // console.log("====================")
        // console.log("http status: " + status)
        // console.log("jwt token: " + data.access_token)
        // console.log("====================")

        return data;

    }catch(error){
        console.log("====================")
        console.error("error message: " + error.message)
        console.log("====================")

        throw Error(error);
    }
}


export async function getGroupByUuid(token: string, uuid:string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.SERVER_URL + ":" + process.env.SERVER_PORT;
        const url: string =  serverAddress + process.env.DEFAULT_URL + proctorControllerUrl + "/group/" + uuid;

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };


        const {data, status} = await axios.get(url, {headers: headers, params: options});

        // console.log("====================")
        // console.log("http status: " + status)
        // console.log("jwt token: " + data.access_token)
        // console.log("====================")

        return data;

    }catch(error){
        console.log("====================")
        console.error("error message: " + error.message)
        console.log("====================")

        throw Error(error);
    }
}