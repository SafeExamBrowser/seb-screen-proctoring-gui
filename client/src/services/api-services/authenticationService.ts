import axios, { AxiosResponse } from 'axios'
import * as ENV from "@/config/envConfig";
import { useAuthStore } from "@/store/app";
import * as apiService from "@/services/api-services/apiService";

export async function login(username: string, password: string): Promise<string | any> {

  try {
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/authorize";

    const response = await axios.post(url, {
      username,
      password
    });

    if (response.status === 200) {
      return response.data;
    } 

  } catch (error) {
    throw error;
  }
}

export async function verifyJwt(token: string): Promise<string | any> {

  try {
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/jwttoken/verify";
    
    const response = await axios.post(url, {token});

    if (response.status === 200) {
      return response.data;
    } 

  } catch (error) {
    throw error;
  }
}



export async function refresh(): Promise<string | any>{
  const authStore = useAuthStore();

  try{
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/refresh";

    const headers = {
      "Authorization": "Bearer " + authStore.getRefreshToken(),
    };
    
    const response: AxiosResponse<Token> = await axios.post(url, {}, {headers: headers});

    return response.data;

  }catch(error){
    throw error;
  }
}

export async function logLogout(){
  try{
    const url: string = "useraccount/logLogout";
    const {data, status}: AxiosResponse = await apiService.api.post(url, {headers: apiService.getHeaders()});

  }catch(error){
    throw error;
  }
}