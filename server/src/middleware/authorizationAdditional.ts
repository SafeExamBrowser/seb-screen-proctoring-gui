import { Request, Response, NextFunction } from 'express';
import * as ENV from "../config/envConfig";
import * as userAccountController from '../controllers/user-account.controller';

//checks if the user is allowed to controll the user account
//if sebIntegratedMode = true --> allowed
//if sebIntegratedMode = false & role = admin --> allowed
export async function isUserAccountOperationAllowed(req: Request, res: Response, next: NextFunction) {
    try {
        if(ENV.SEB_SERVER_INTEGRATED_MODE == "false"){
            next();
        }

        const userAccount = await userAccountController.getPersonalUserAccount(req, res);
        console.log("teeeeeeest======")
        console.log(userAccount);

        next();



        // Call to your backend API to check if the user is an admin
        // const isAdmin = await someApiCallToCheckAdmin(req.headers.authorization);
        // if (isAdmin) {
        //     next(); // User is admin, continue to the next middleware or route handler
        // } else {
        //     res.status(401).json({ message: 'Unauthorized' }); // User is not admin, respond with 401
        // }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
