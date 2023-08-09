import {Request, Response} from 'express';

import * as adminProctorSessionService from '../services/admin-proctor-session.service';

export async function getSessionBySessionId(req: Request, res: Response){

    try{
        const groups: object = await adminProctorSessionService.getSessionBySessionId(req.headers.authorization, req.params.sessionId);

        return res.status(200).json(groups);

    }catch(error){
        if(isNaN(error.messsage)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}


export async function getSessionByTimestamp(req: Request, res: Response){

    try{
        const group: object = await adminProctorSessionService.getSessionByTimestamp(req.headers.authorization, req.params.sessionId, req.params.timestamp);

        return res.status(200).json(group);

    }catch(error){
        if(isNaN(error.messsage)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}