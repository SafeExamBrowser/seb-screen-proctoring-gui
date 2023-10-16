import {Request, Response} from "express";
import * as adminProctorUserAccountService from "../services/admin-proctor-user-account.service";


export async function getUserAccountById(){

}

export async function getUserAccounts(){

}

export async function createUserAccount(){

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

        console.log("it got here")
        console.log(error)

        if(isNaN(error.message)){
            return res.status(500).send();
        }

        return res.status(JSON.parse(error.message)).send();
    }

}