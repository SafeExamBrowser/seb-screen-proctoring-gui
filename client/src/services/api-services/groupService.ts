import { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function getGroups(optionalParamters?: OptionalParGroups): Promise<Group[] | any> {

  try {
    const url: string = "/group";
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}});

    if (status === 200) {
      return data.content;
    }

  } catch (error) {
    throw error;
  }
}

export async function getGroupByUuid(uuid: string, optionalParamters?: OptionalParGroupByUuid): Promise<GroupUuid | any> {

  try {
    const url: string = "/group/" + uuid;
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}