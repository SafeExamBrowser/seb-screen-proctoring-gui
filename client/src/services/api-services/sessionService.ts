import axios, { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function getSessionBySessionId(sessionId: string): Promise<Screenshot | any> {

  try {
    const url: string = "/session/" + sessionId;
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders()});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}

export async function getSessionByTimestamp(sessionId: string, timestamp: string): Promise<Screenshot | any> {

  try {
    const url: string = "/session/" + sessionId + "/" + timestamp;
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders()});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}