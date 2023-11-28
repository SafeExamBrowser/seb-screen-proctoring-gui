import {Request, Response} from 'express';
import * as apiService from "../services/api.service";
import * as screenshotDataService from '../services/screenshot-data.service';

export async function getScreenshotDataBySessionId(req: Request, res: Response){

    try{
        const session: object = await screenshotDataService.getScreenshotDataBySessionId(req.headers.authorization, req.params.sessionId);

        return res.status(200).json(session);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function getScreenshotDataByTimestamp(req: Request, res: Response){

    try{
        const session: object = await screenshotDataService.getScreenshotDataByTimestamp(req.headers.authorization, req.params.sessionId, req.params.timestamp);

        return res.status(200).json(session);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function getScreenshotTimestamps(req: Request, res: Response){

    try{
        const session: object = await screenshotDataService.getScreenshotTimestamps(req.headers.authorization, req.params.sessionId);

        return res.status(200).json(session);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}