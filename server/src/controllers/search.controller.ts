import {Request, Response} from 'express';
import * as apiService from "../services/api.service";
import * as searchService from '../services/search.service';

export async function searchSessionsDay(req: Request, res: Response){

    try{
        const sessions: object = await searchService.searchSessionsDay(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(sessions);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function searchSessions(req: Request, res: Response){
    try{
        const sessions: object = await searchService.searchSessions(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(sessions);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function searchScreenshots(req: Request, res: Response){
    try{
        const screenshots: object = await searchService.searchScreenshots(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(screenshots);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function searchTimeline(req: Request, res: Response){
    try{
        const timeline: object = await searchService.searchTimeline(req.headers.authorization, req.params.sessionId, req.query.optionalParamters);

        return res.status(200).json(timeline);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}