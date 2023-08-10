import axios, { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function getGroups(pageNumber?: number, pageSize?: number, filterCriteria?: string): Promise<Group[] | any> {

  try {
    const url: string = "/group";
    const {data, status}: AxiosResponse<GroupResponse> = await apiService.api.get(url, {headers: getHeaders()});

    if (status === 200) {
      return data.content;
    }


  } catch (error) {
    throw error;
  }
}

export async function getGroupByUuid(uuid: string, optionalParamters?: OptionalParGroupByUuid): Promise<GroupUuid[] | any> {

  try {
    const url: string = "/group/" + uuid;
    const {data, status}: AxiosResponse<Group> = await apiService.api.get(url, {headers: getHeaders(), params: {optionalParamters}});

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