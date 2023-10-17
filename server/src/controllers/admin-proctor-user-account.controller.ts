import {Request, Response} from "express";
import * as adminProctorUserAccountService from "../services/admin-proctor-user-account.service";
import * as apiService from "../services/api.service";


export async function getUserAccountById(){

}

export async function getUserAccounts(){

}

export async function getPersonalUserAccount(req: Request, res: Response){
    try{
        const personalUserAccount: object = await adminProctorUserAccountService.getPersonalUserAccount(req.headers.authorization)

        return res.status(200).json(personalUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
    
}

export async function deleteUserAccount(){

}

export async function changeUserAccountPassword(){

}

export async function editUserAccount(){

}



export async function registerUserAccount(req: Request, res: Response){

    try{
        const newUserAccount: object = await adminProctorUserAccountService.registerUserAccount(req.body)

        return res.status(200).json(newUserAccount);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }

}