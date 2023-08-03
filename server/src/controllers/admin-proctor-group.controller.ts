import {Request, Response} from 'express';

import * as adminProctorGroupService from '../services/admin-proctor-group.service';

export async function getGroups(req: Request, res: Response){

    try{
        const groups: object = await adminProctorGroupService.getGroups(req.headers.authorization);

        return res.status(200).json(groups);

    }catch(error){
        if(isNaN(error.messsage)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}


export async function getGroupByUuid(req: Request, res: Response){

    try{
        const group: object = await adminProctorGroupService.getGroupByUuid(req.headers.authorization, req.params.uuid, req.query.optionalParamters);

        return res.status(200).json(group);

    }catch(error){
        if(isNaN(error.messsage)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }
}