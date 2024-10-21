import {Request, Response} from "express";
import * as apiService from "../services/api.service";
import * as applicationSearchService from "../services/application-search.service";

export async function getExamsStarted(req: Request, res: Response){
    try{
        const exams: object = await applicationSearchService.getExamsStarted(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getGroupIdsForExam(req: Request, res: Response){
    try{
        const exams: object = await applicationSearchService.getGroupIdsForExam(req.headers.authorization, req.params.examId);

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getDistinctMetadataAppForExam(req: Request, res: Response){
    try{
        const exams: object = await applicationSearchService.getDistinctMetadataAppForExam(req.headers.authorization, req.query.groupIds);

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getDistinctMetadataWindowForExam(req: Request, res: Response){
    try{
        const exams: object = await applicationSearchService.getDistinctMetadataWindowForExam(req.headers.authorization, {
            "groupIds": req.query.groupIds,
            "screenProctoringMetadataApplication": req.query.screenProctoringMetadataApplication,
        });

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getUserListForApplicationSearch(req: Request, res: Response){
    try{
        const exams: object = await applicationSearchService.getUserListForApplicationSearch(req.headers.authorization, {
            "groupIds": req.query.groupIds,
            "screenProctoringMetadataApplication": req.query.screenProctoringMetadataApplication,
            "screenProctoringMetadataWindowTitle": req.query.screenProctoringMetadataWindowTitle
        });

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getTimestampListForApplicationSearch(req: Request, res: Response){
    try{
        const exams: object = await applicationSearchService.getTimestampListForApplicationSearch(req.headers.authorization, {
            "sessionUUID": req.query.sessionUUID,
            "screenProctoringMetadataApplication": req.query.screenProctoringMetadataApplication,
            "screenProctoringMetadataWindowTitle": req.query.screenProctoringMetadataWindowTitle
        });

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}