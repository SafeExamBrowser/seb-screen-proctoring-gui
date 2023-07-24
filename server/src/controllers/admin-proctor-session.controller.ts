import {Request, Response} from 'express';

import * as adminProctorSessionService from '../services/admin-proctor-session.service';

export async function getSessionBySessionId(req: Request, res: Response){

    try{
        console.log("req.params.sessionId: " + req.params.sessionId)
        const groups: object = await adminProctorSessionService.getSessionBySessionId(req.headers.authorization, req.params.sessionId);

        return res.status(200).json(groups);

    }catch(error){
        return res.status(400).json({status: 400, message: error.message});
    }
}


export async function getSessionByTimestamp(req: Request, res: Response){

    try{

        console.log("params")
        console.log(req.query.optionalParamters)

        const group: object = await adminProctorSessionService.getSessionByTimestamp(req.headers.authorization, req.params.sessionId, req.params.timestamp);

        return res.status(200).json(group);

    }catch(error){
        return res.status(400).json({status: 400, message: error.message});
    }
}