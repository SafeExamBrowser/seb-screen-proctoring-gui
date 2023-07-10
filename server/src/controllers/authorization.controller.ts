import {Request, Response} from 'express';

import * as authorizationService from '../services/authorization.service';

export async function authorize(req: Request, res: Response){

    try{

        const username: string = req.body.username;
        const password: string = req.body.password;

        const tokenObject: object = await authorizationService.authorizeViaScreenProctoringServer(username, password);

        return res.json(tokenObject);

    }catch (error){

    }
}



