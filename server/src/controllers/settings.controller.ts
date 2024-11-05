import {Request, Response} from 'express';
import * as apiService from "../services/api.service";
import * as settingsService from '../services/settings.service';


export async function getSettings(req: Request, res: Response){
    try{
        const settings: Settings = settingsService.getSettings();
        return res.status(200).json(settings);

    }catch(error){
        apiService.handleGenericApiError(error, res);
    }
}
