import { AxiosResponse } from "axios";
import * as apiService from "@/services/api-services/apiService";

export async function getExamsStarted(optionalParamters?: OptionalParGetExamsStarted): Promise<Exam[] | any> {
    const url: string = "/search/applications/exams";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(), params: { optionalParamters } })).data;
}

export async function getGroupIdsForExam(examId: number): Promise<number[] | any> {
    const url: string = "/search/applications/groupIds/" + examId;
    return (await apiService.api.get(url, { headers: apiService.getHeaders()})).data;
}

export async function getDistinctMetadataAppForExam(groupIds: string): Promise<string[] | any> {
    const url: string = "/search/applications/metadata/app";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(), params: { groupIds }})).data;
}

export async function getDistinctMetadataWindowForExam(groupIds: string, screenProctoringMetadataApplication: string): Promise<DistinctMetadataWindowForExamRecord | any> {
    const url: string = "/search/applications/metadata/window";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(), params: { groupIds, screenProctoringMetadataApplication } })).data;
}

export async function getUserListForApplicationSearch(groupIds: string, screenProctoringMetadataApplication: string, screenProctoringMetadataWindowTitle: string): Promise<UserListForApplicationSearchRecord[] | any> {
    const url: string = "/search/applications/users";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(), params: { groupIds, screenProctoringMetadataApplication, screenProctoringMetadataWindowTitle } })).data;
}

export async function getTimestampListForApplicationSearch(sessionUUID: string, screenProctoringMetadataApplication: string, screenProctoringMetadataWindowTitle: string): Promise<number[] | any> {
    const url: string = "/search/applications/timestamps";
    return (await apiService.api.get(url, { headers: apiService.getHeaders(), params: { sessionUUID, screenProctoringMetadataApplication, screenProctoringMetadataWindowTitle } })).data;
}