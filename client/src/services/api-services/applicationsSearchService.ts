import { AxiosResponse } from "axios";
import * as apiService from "@/services/api-services/apiService";

export async function getExamsStarted(optionalParamters?: OptionalParGetExamsStarted): Promise<Exam[] | any> {
    try {
        const url: string = "/search/applications/exams";
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders(), params: { optionalParamters } });

        if (status === 200) {
            return data;
        }


    } catch (error) {
        throw error;
    }
}

export async function getGroupIdsForExam(examId: number): Promise<number[] | any> {
    try {
        const url: string = "/search/applications/groupIds/" + examId;
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders()});

        if (status === 200) {
            return data;
        }


    } catch (error) {
        throw error;
    }
}

export async function getDistinctMetadataAppForExam(groupIds: string): Promise<string[] | any> {
    try {
        const url: string = "/search/applications/metadata/app";
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders(), params: { groupIds }});

        if (status === 200) {
            return data;
        }


    } catch (error) {
        throw error;
    }
}

export async function getDistinctMetadataWindowForExam(groupIds: string, screenProctoringMetadataApplication: string): Promise<DistinctMetadataWindowForExamRecord | any> {
    try {
        const url: string = "/search/applications/metadata/window";
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders(), params: { groupIds, screenProctoringMetadataApplication } });

        if (status === 200) {
            return data;
        }


    } catch (error) {
        throw error;
    }
}

export async function getUserListForApplicationSearch(groupIds: string, screenProctoringMetadataApplication: string, screenProctoringMetadataWindowTitle: string): Promise<UserListForApplicationSearchRecord[] | any> {
    try {
        const url: string = "/search/applications/users";
        const { data, status }: AxiosResponse = await apiService.api.get(url, { headers: apiService.getHeaders(), params: { groupIds, screenProctoringMetadataApplication, screenProctoringMetadataWindowTitle } });

        if (status === 200) {
            return data;
        }


    } catch (error) {
        throw error;
    }
}