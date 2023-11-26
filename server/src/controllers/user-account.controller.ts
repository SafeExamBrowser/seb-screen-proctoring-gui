import {Request, Response} from "express";
import * as userAccountService from "../services/user-account.service";
import * as apiService from "../services/api.service";


export async function getPersonalUserAccount(req: Request, res: Response){
    try{
        const personalUserAccount: object = await userAccountService.getPersonalUserAccount(req.headers.authorization)
        return res.status(200).json(personalUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
    
}


export async function getUserAccountById(req: Request, res: Response){
    try{
        const userAccount: object = await userAccountService.getUserAccountById(req.headers.authorization, req.params.accountId)

        return res.status(200).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
    
}


export async function registerUserAccount(req: Request, res: Response){

    try{
        const newUserAccount: object = await userAccountService.registerUserAccount(req.body)
        return res.status(200).json(newUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }

}

export async function changePassword(req: Request, res: Response){
    try{
        const newUserAccount: object = await userAccountService.changePassword(req.headers.authorization, req.body)
        return res.status(200).json(newUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function getUserAccounts(req: Request, res: Response){
    try{
        const userAccounts: object = await userAccountService.getUserAccounts(req.headers.authorization, req.query.optionalParamters)

        return res.status(200).json(userAccounts);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function activateUserAccount(req: Request, res: Response){
    try{
        const userAccount: object = await userAccountService.activateUserAccount(req.headers.authorization, req.params.accountId)

        return res.status(200).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function deactivateUserAccount(req: Request, res: Response){

    try{
        const userAccount: object = await userAccountService.deactivateUserAccount(req.headers.authorization, req.params.accountId)

        return res.status(200).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}