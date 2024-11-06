import axios, { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";
import { SortOrder } from "@/models/sortOrderEnum";

export async function getScreenshotDataBySessionId(sessionId: string): Promise<ScreenshotData | any> {
    const url: string = "/screenshot-data/" + sessionId;
    return (await apiService.api.get(url, { headers: apiService.getHeaders() })).data;
}

export async function getScreenshotDataByTimestamp(sessionId: string, timestamp: string): Promise<ScreenshotData | any> {
    const url: string = "/screenshot-data/" + sessionId + "/" + timestamp;
    return (await apiService.api.get(url, { headers: apiService.getHeaders() })).data;
}

export async function getScreenshotTimestamps(sessionId: string, timestamp: string, direction: SortOrder) {
    const url: string = "/screenshot-timestamps/" + sessionId + "/" + timestamp + "/" + direction;
    return (await apiService.api.get(url, { headers: apiService.getHeaders() })).data;
}