import * as apiService from "./api.service";
import * as ENV from "../config/envConfig";

const applicationSearchUrl: string = "/proctoring/search/applications";

export async function getExamsStarted(token: string, options?: {}): Promise<object>{
    const url: string = applicationSearchUrl + "/exams";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return data;
}

export async function getGroupIdsForExam(token: string, examId: string): Promise<object>{
    const url: string = applicationSearchUrl + "/groupIds/" + examId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return data;
}

export async function getDistinctMetadataAppForExam(token: string, groupIds: {}): Promise<object>{
    const url: string = applicationSearchUrl + "/metadata/app";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: {groupIds}});

    return data;
}

export async function getDistinctMetadataWindowForExam(token: string, params: {}): Promise<object>{
    const url: string = applicationSearchUrl + "/metadata/window";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: params});

    return data;
}

export async function getUserListForApplicationSearch(token: string, params: {}): Promise<object>{
    const url: string = applicationSearchUrl + "/users";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: params});

    return data;
}