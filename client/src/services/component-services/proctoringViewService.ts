import * as sessionService from "@/services/api-services/sessionService";
import * as timeUtils from "@/utils/timeUtils";


//=============api==================
export async function getSessionBySessionId(sessionId: string): Promise<Screenshot | null>{
    try{
        return await sessionService.getSessionBySessionId(sessionId);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getSessionByTimestamp(sessionId: string, timestamp: string): Promise<Screenshot | null>{
    try{
        return await sessionService.getSessionByTimestamp(sessionId, timestamp);        
    }catch(error){
        console.error(error);
        return null;
    }
}
//==============================

//=============metadata==================
export function getScreenshotMetadata(sliderTime: number, currentScreenshotMetadata: MetaData | null, additionalMetadataInfo: string, total: string): object{
    return {
        "Total:": total,
        "Date:": timeUtils.formatTimestmapToDate(sliderTime),
        "Time:": timeUtils.formatTimestmapToTime(sliderTime),
        "Url:": currentScreenshotMetadata?.screenProctoringMetadataURL,
        "Window Title:": currentScreenshotMetadata?.screenProctoringMetadataWindowTitle,
        "User-Action:": currentScreenshotMetadata?.screenProctoringMetadataUserAction + " " + additionalMetadataInfo
    };
}

export function getSessionInfodata(session: Screenshot | null): object{
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