import {Request, Response} from "express";
import * as apiService from "../services/api.service";
import * as applicationService from "../services/application.service";

export async function getExamsStarted(req: Request, res: Response){
    try{
        const exams: object = await applicationService.getExamsStarted(req.headers.authorization, req.query.optionalParamters);

        return res.status(200).json(exams);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}