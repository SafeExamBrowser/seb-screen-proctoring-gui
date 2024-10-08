import { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function searchSessionsDay(optionalParamters?: OptionalParSearchSessions): Promise<string[] | any> {
    try {
      const url: string = "/search/sessions/day";
      const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}});
  
      if (status === 200) {
        return data;
      }
  
    } catch (error) {
      throw error;
    }
}

export async function searchSessions(optionalParamters?: OptionalParSearchSessions): Promise<SearchSessions | any> {
  try {
    const url: string = "/search/sessions";
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}

export async function searchScreenshots(optionalParamters?: OptionalParSearchScreenshots): Promise<SearchScreenshots | any> {
  try {
    const url: string = "/search/screenshots"
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}

export async function searchTimeline(sessionId: string, optionalParamters?: OptionalParSearchTimeline): Promise<SearchTimeline | any> {
  try {
    const url: string = "/search/timeline/" + sessionId;
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}});

    if (status === 200) {
      return data;
    }

    } catch (error) {
      throw error;
    }
}