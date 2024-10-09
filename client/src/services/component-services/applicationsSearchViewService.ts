import * as applicationService from "@/services/api-services/applicationsSearchService";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import {openUrlInNewTab} from "@/router/navigation";
import * as constants from "@/utils/constants";

//=============api==============
export async function getExamsStarted(optionalParamters?: OptionalParGetExamsStarted): Promise<Exam[] | null>{
    try{
        return await applicationService.getExamsStarted(optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getGroupIdsForExam(examId: number): Promise<number[] | null>{
    try{
        return await applicationService.getGroupIdsForExam(examId);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getDistinctMetadataAppForExam(groupIds: string): Promise<string[] | null>{
    try{
        return await applicationService.getDistinctMetadataAppForExam(groupIds);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getDistinctMetadataWindowForExam(groupIds: string, screenProctoringMetadataApplication: string): Promise<DistinctMetadataWindowForExamRecord | null>{
    try{
        return await applicationService.getDistinctMetadataWindowForExam(groupIds, screenProctoringMetadataApplication);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getUserListForApplicationSearch(groupIds: string, screenProctoringMetadataApplication: string, screenProctoringMetadataWindowTitle: string): Promise<UserListForApplicationSearchRecord[] | null>{
    try{
        return await applicationService.getUserListForApplicationSearch(groupIds, screenProctoringMetadataApplication, screenProctoringMetadataWindowTitle);        
    }catch(error){
        console.error(error);
        return null;
    }
}