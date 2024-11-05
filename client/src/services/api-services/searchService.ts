import { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function searchSessionsDay(optionalParamters?: OptionalParSearchSessions): Promise<string[] | any> {
    const url: string = "/search/sessions/day";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}

export async function searchSessions(optionalParamters?: OptionalParSearchSessions): Promise<SearchSessions | any> {
    const url: string = "/search/sessions";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}

export async function searchScreenshots(optionalParamters?: OptionalParSearchScreenshots): Promise<SearchScreenshots | any> {
    const url: string = "/search/screenshots"
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}

export async function searchTimeline(sessionId: string, optionalParamters?: OptionalParSearchTimeline): Promise<SearchTimeline | any> {
    const url: string = "/search/timeline/" + sessionId;
    return (await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}})).data;
}

export async function deleteSessions(sessionUuids: string[]): Promise<SearchTimeline | any> {
    const url: string = "/search/sessions/delete" + apiService.createSessionDeleteUrlSuffix(sessionUuids);
    return (await apiService.api.delete(url, {headers: apiService.getHeaders()})).data;
}