import {Request, Response} from 'express';

import * as authorizationService from '../services/authorization.service';

export async function authorize(req: Request, res: Response){

    try{
        const username: string = req.body.username;
        const password: string = req.body.password;
        const tokenObject: object = await authorizationService.authorizeViaScreenProctoringServer(username, password);

        return res.status(200).json(tokenObject);

    }catch(error){
        return res.status(400).json({status: 400, message: error.message});
    }
    

}