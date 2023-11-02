import {Request, Response} from 'express';
import * as apiService from "../services/api.service";
import * as adminProctorSessionService from '../services/admin-proctor-session.service';

export async function getSessionBySessionId(req: Request, res: Response){

    try{
        const session: object = await adminProctorSessionService.getSessionBySessionId(req.headers.authorization, req.params.sessionId);

        return res.status(200).json(session);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function getSessionByTimestamp(req: Request, res: Response){

    try{
        const session: object = await adminProctorSessionService.getSessionByTimestamp(req.headers.authorization, req.params.sessionId, req.params.timestamp);

        return res.status(200).json(session);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}