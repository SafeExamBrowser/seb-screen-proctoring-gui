import {Request, Response} from 'express';

import * as adminProctorGroupService from '../services/admin-proctor-group.service';

export async function getGroups(req: Request, res: Response){

    try{
        const groups: object = await adminProctorGroupService.getGroups(req.headers.authorization);

        return res.status(200).json(groups);

    }catch(error){
        return res.status(400).json({status: 400, message: error.message});
    }
}


export async function getGroupByUuid(req: Request, res: Response){

    try{

        console.log("params")
        console.log(req.query.optionalParamters)

        const group: object = await adminProctorGroupService.getGroupByUuid(req.headers.authorization, req.params.uuid, req.query.optionalParamters);

        return res.status(200).json(group);

    }catch(error){
        return res.status(400).json({status: 400, message: error.message});
    }
}