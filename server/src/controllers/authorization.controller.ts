import {Request, Response} from 'express';

import * as authorizationService from '../services/authorization.service';

export async function authorize(req: Request, res: Response){

    try{
        const username: string = req.body.username;
        const password: string = req.body.password;
        const tokenObject: object = await authorizationService.authorizeViaScreenProctoringServer(username, password);

        return res.status(200).json(tokenObject);

    }catch(error){
        return res.status(JSON.parse(error.message)).send();
    }
}

export async function refresh(req: Request, res: Response){

    try{
        const tokenObject: object = await authorizationService.refreshViaScreenProctoringServer(req.headers.authorization.split(" ")[1]);

        return res.status(200).json(tokenObject);

    }catch(error){
        return res.status(JSON.parse(error.message)).send();
    }
}