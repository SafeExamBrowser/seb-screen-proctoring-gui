import {Request, Response} from "express";
import * as adminProctorUserAccountService from "../services/admin-proctor-user-account.service";
import * as apiService from "../services/api.service";


export async function getPersonalUserAccount(req: Request, res: Response){
    try{
        const personalUserAccount: object = await adminProctorUserAccountService.getPersonalUserAccount(req.headers.authorization)

        return res.status(200).json(personalUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
    
}


export async function getUserAccountById(req: Request, res: Response){
    try{
        const userAccount: object = await adminProctorUserAccountService.getUserAccountById(req.headers.authorization, req.params.accountId)

        return res.status(200).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
    
}


export async function registerUserAccount(req: Request, res: Response){
    try{
        const newUserAccount: object = await adminProctorUserAccountService.registerUserAccount(req.body)

        return res.status(200).json(newUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }

}

export async function changePassword(req: Request, res: Response){
    console.log("changePassword server controller body:", req.body)
    try{
        const newUserAccount: object = await adminProctorUserAccountService.changePassword(req.body)

        return res.status(200).json(newUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }

}


export async function getUserAccounts(req: Request, res: Response){
    try{
        const userAccounts: object = await adminProctorUserAccountService.getUserAccounts(req.headers.authorization, req.query.optionalParamters)

        return res.status(200).json(userAccounts);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function activateUserAccount(req: Request, res: Response){
    try{
        const userAccount: object = await adminProctorUserAccountService.activateUserAccount(req.headers.authorization, req.params.accountId)

        return res.status(200).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}


export async function deactivateUserAccount(req: Request, res: Response){
    try{
        const userAccount: object = await adminProctorUserAccountService.deactivateUserAccount(req.headers.authorization, req.params.accountId)

        return res.status(200).json(userAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}