import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";

export async function getSettings(): Promise<Settings | any>{
    try{
        const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/settings";
        const {data, status}: AxiosResponse = await axios.get(url);
  
        if (status === 200) {
            return data;
        } 

    }catch(error){
        console.error(error);
        return null;
    }
  }