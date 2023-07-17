import {Request, Response} from 'express';

import * as adminProctorService from '../services/admin-proctor.service';

export async function getGroups(req: Request, res: Response){

    try{
        const groups: object = await adminProctorService.getGroups(req.headers.authorization);

        return res.status(200).json(groups);

    }catch(error){
        return res.status(400).json({status: 400, message: error.message});
    }
}


export async function getGroupByUuid(req: Request, res: Response){

    try{
        const group: object = await adminProctorService.getGroupByUuid(req.headers.authorization, req.params.uuid);

        return res.status(200).json(group);

    }catch(error){
        return res.status(400).json({status: 400, message: error.message});
    }
}