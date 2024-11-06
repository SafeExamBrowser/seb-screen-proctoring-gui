import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";

export async function getSettings(): Promise<Settings | any>{
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/settings";
    return (await axios.get(url)).data;
}