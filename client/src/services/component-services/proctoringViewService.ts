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
export function getScreenshotMetadata(sliderTime: number, currentScreenshotMetadata: string): object{
    return {
        "Date": timeUtils.formatTimestmapToDate(sliderTime),
        "Time:": timeUtils.formatTimestmapToTime(sliderTime),
        //todo: remove temporary hardcoded data
        "Active Program:": "Web-Browser",
        "Current URL:":" moodle.com",
        "Title Website:": "Exam xyz",
        "remaing metadata:": currentScreenshotMetadata
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


//=============index==================


//=============links==================

//=============error handling==================