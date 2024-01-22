import * as screenshotDataService from "@/services/api-services/screenshotDataService";
import * as timeUtils from "@/utils/timeUtils";
import { SortOrder } from "@/models/sortOrderEnum";

//=============api==================
export async function getScreenshotDataBySessionId(sessionId: string): Promise<ScreenshotData | null>{
    try{
        return await screenshotDataService.getScreenshotDataBySessionId(sessionId);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getScreenshotDataByTimestamp(sessionId: string, timestamp: string): Promise<ScreenshotData | null>{
    try{
        return await screenshotDataService.getScreenshotDataByTimestamp(sessionId, timestamp);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getScreenshotTimestamps(sessionId: string, timestamp: string, direction: SortOrder): Promise<number[] | null>{
    try{
        return await screenshotDataService.getScreenshotTimestamps(sessionId, timestamp, direction);        
    }catch(error){
        console.error(error);
        return null;
    }
}
//==============================


//=============metadata=========
export function getScreenshotMetadata(sliderTime: number, currentScreenshotMetadata: MetaData | null, additionalMetadataInfo: string, total: string): object{
    return {
        "Total:": total,
        "Date:": timeUtils.formatTimestampToDate(sliderTime),
        "Time:": timeUtils.formatTimestampToTime(sliderTime),
        "Url:": currentScreenshotMetadata?.screenProctoringMetadataURL,
        "Window Title:": currentScreenshotMetadata?.screenProctoringMetadataWindowTitle,
        "User-Action:": currentScreenshotMetadata?.screenProctoringMetadataUserAction + " " + additionalMetadataInfo
    };
}

export function getSessionInfodata(session: ScreenshotData | null): object{
    if(session == null){
        return {};
    }

    return {
        "Client Name:": session.clientName,
        "Client IP:": session.clientIp,
        "Client Version:": session.clientVersion,
        "Client Machine Name:": session.clientMachineName,
        "Client OS:": session.clientOsName,
        "Is Session Active:": session.active.toString()
    };
}