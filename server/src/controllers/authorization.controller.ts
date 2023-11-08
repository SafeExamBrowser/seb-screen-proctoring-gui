import {Request, Response} from 'express';
import * as apiService from "../services/api.service";
import * as authorizationService from '../services/authorization.service';

export async function authorize(req: Request, res: Response){

    try{
        const username: string = req.body.username;
        const password: string = req.body.password;
        const tokenObject: any = await authorizationService.authorizeViaScreenProctoringServer(username, password);

        await authorizationService.logLogin("Bearer " + tokenObject.access_token);

        return res.status(200).json(tokenObject);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function verifyJwt(req: Request, res: Response){

    try{
        const token: string = req.body.token;

        const tokenObject: any = await authorizationService.verifyJwt(token);

        return res.status(200).json(tokenObject);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function refresh(req: Request, res: Response){

    try{
        const tokenObject: object = await authorizationService.refreshViaScreenProctoringServer(req.headers.authorization.split(" ")[1]);

        return res.status(200).json(tokenObject);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function logLogin(req: Request, res: Response){
    try{
        //does not return data
        await authorizationService.logLogin(req.headers.authorization);

        return res.status(200).json();

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}

export async function logLogout(req: Request, res: Response){
    try{
        //does not return data
        console.log(req.headers.authorization)
        await authorizationService.logLogout(req.headers.authorization);

        return res.status(200).json();

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}