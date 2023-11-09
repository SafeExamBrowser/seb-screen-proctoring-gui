import {Request, Response} from 'express';
import * as apiService from "../services/api.service";
import * as adminProctorSearchService from '../services/search.service';

export async function searchSessions(req: Request, res: Response){

    try{
        const sessions: object = await adminProctorSearchService.searchSessions(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(sessions);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function searchScreenshots(req: Request, res: Response){

    try{
        const screenshots: object = await adminProctorSearchService.searchScreenshots(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(screenshots);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function searchTimeline(req: Request, res: Response){

    try{
        const timeline: object = await adminProctorSearchService.searchTimeline(req.headers.authorization, req.params.sessionId, req.query.optionalParamters);

        return res.status(200).json(timeline);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}