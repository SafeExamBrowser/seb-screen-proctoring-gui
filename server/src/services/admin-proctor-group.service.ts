import axios, {AxiosHeaders} from "axios";
import {LOG} from '../logging/logger';


const proctorControllerUrl: string = "/proctoring";

export async function getGroups(token: string, pageNumber?: number, pageSize?: number, filterCriteria?: string): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.PROCTOR_SERVER_URL + ":" + process.env.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + process.env.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/group";

        const headers = {
            "accept": "application/json",
            "Authorization": token,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        const {data, status} = await axios.get(url, { headers });

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


export async function getGroupByUuid(token: string, uuid:string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const serverAddress: string = process.env.PROCTOR_SERVER_URL + ":" + process.env.PROCTOR_SERVER_PORT;
        const url: string =  serverAddress + process.env.PROCTOR_DEFAULT_URL + proctorControllerUrl + "/group/" + uuid;

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