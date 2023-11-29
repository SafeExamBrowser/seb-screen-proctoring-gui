import axios from "axios";
import * as apiService from "./api.service";

const screenshotDataUrl: string = "/proctoring/screenshot-data/";
const screenshotTimestampsUrl: string = "/proctoring/screenshot-timestamps/";

export async function getScreenshotDataBySessionId(token: string, sessionId: string): Promise<object>{
    const url: string = screenshotDataUrl + sessionId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return data;
}

export async function getScreenshotDataByTimestamp(token: string, sessionId: string, timestamp: string): Promise<object>{
    const url: string =  screenshotDataUrl + sessionId + "/" + timestamp;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return data;
}

export async function getScreenshotTimestamps(token: string, sessionId: string, timestamp: string): Promise<object>{
    const url: string =  screenshotTimestampsUrl + sessionId + "/" + timestamp;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return data;
}