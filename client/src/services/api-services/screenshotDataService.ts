import axios, { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";
import { SortOrder } from "@/models/sortOrderEnum";

export async function getScreenshotDataBySessionId(sessionId: string): Promise<ScreenshotData | any> {

    try {
        const url: string = "/screenshot-data/" + sessionId;
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function getScreenshotDataByTimestamp(sessionId: string, timestamp: string): Promise<ScreenshotData | any> {

    try {
        const url: string = "/screenshot-data/" + sessionId + "/" + timestamp;
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}

export async function getScreenshotTimestamps(sessionId: string, timestamp: string, direction: SortOrder) {
    try {
        const url: string = "/screenshot-timestamps/" + sessionId + "/" + timestamp + "/" + direction;
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders() });

        if (status === 200) {
            return data;
        }

    } catch (error) {
        throw error;
    }
}