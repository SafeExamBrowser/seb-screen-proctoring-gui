import axios, { AxiosResponse } from "axios";
import * as ENV from "@/config/envConfig";
import * as apiService from "@/services/api-services/apiService";

export async function register(
  name: string,
  surname: string,
  username: string,
  newPassword: string,
  confirmNewPassword: string,
  email?: string,
  timeZone?: string,
): Promise<string | any> {

  try {
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/useraccount/register";

    const {data, status}: AxiosResponse = await axios.post(url, {
      name,
      surname,
      username,
      newPassword,
      confirmNewPassword,
      email,
      timeZone
    });

    if (status === 200) {
      return data;
    } 

  } catch (error) {
    throw error;
  }
}

const userAccountUrl: string = "/useraccount";

export async function getPersonalUserAccount(): Promise<UserAccount | any>{
  try{
    const url: string = userAccountUrl + "/me";
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders()});

    if (status === 200) {
      return data;
    } 

  }catch(error){
    throw error;
  }
}