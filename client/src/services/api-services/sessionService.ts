import axios, { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function getSessionBySessionId(sessionId: string): Promise<Screenshot | any> {

  try {
    //todo: add env desc to gihub
    const url: string = "/session/" + sessionId;
    const {data, status}: AxiosResponse<GroupResponse> = await apiService.api.get(url, {headers: getHeaders()});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}

export async function getSessionByTimestamp(sessionId: string, timestamp: string): Promise<Screenshot | any> {

  try {
    //todo: add env desc to gihub
    const url: string = "/session/" + sessionId + "/" + timestamp;
    const {data, status}: AxiosResponse<Group> = await apiService.api.get(url, {headers: getHeaders()});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}

function getHeaders(): object{
  return {
    "accept": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
    "Content-Type": "application/x-www-form-urlencoded"
  };
}