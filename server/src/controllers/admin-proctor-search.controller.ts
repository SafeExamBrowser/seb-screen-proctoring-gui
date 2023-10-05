import {Request, Response} from 'express';

import * as adminProctorSearchService from '../services/admin-proctor-search.service';

export async function searchSessions(req: Request, res: Response){

    try{
        const sessions: object = await adminProctorSearchService.searchSessions(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(sessions);

    }catch(error){
        if(isNaN(error.message)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}


export async function searchScreenshots(req: Request, res: Response){

    try{
        const screenshots: object = await adminProctorSearchService.searchScreenshots(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(screenshots);

    }catch(error){
        if(isNaN(error.message)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}

export async function searchTimeline(req: Request, res: Response){

    try{
        const timeline: object = await adminProctorSearchService.searchTimeline(req.headers.authorization, req.params.sessionId, req.query.optionalParamters);

        return res.status(200).json(timeline);

    }catch(error){
        if(isNaN(error.message)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}