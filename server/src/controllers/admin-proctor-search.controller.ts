import {Request, Response} from 'express';

import * as adminProctorSearchService from '../services/admin-proctor-search.service';

export async function searchSessions(req: Request, res: Response){

    try{
        const groups: object = await adminProctorSearchService.searchSessions(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(groups);

    }catch(error){
        if(isNaN(error.message)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}


export async function searchScreenshots(req: Request, res: Response){

    try{
        const group: object = await adminProctorSearchService.searchScreenshots(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(group);

    }catch(error){
        if(isNaN(error.message)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}