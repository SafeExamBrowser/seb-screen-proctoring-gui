import * as apiService from "./api.service";

const applicationsUrl: string = "/proctoring/applications";

export async function getExamsStarted(token: string, options?: {}): Promise<object>{
    const url: string = applicationsUrl + "/exams-started";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return data;
}