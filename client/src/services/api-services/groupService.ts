import { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function getGroups(optionalParamters?: OptionalParGroups): Promise<GroupObject | any> {
    const url: string = "/group";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}

export async function getGroupByUuid(uuid: string, optionalParamters?: OptionalParGroupByUuid): Promise<GroupUuid | any> {
    const url: string = "/group/" + uuid;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}