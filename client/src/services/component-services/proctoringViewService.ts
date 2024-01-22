import * as screenshotDataService from "@/services/api-services/screenshotDataService";
import * as timeUtils from "@/utils/timeUtils";
import { SortOrder } from "@/models/sortOrderEnum";
import { formatInTimeZone } from 'date-fns-tz'

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
export function getScreenshotMetadata(sliderTime: number, currentScreenshotMetadata: MetaData | null, additionalMetadataInfo: string, total: string, userTimezone?: string): object{
    const timezone = userTimezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Asia/Kabul';
    return {
        "Total:": total,
        "Date:": formatInTimeZone(sliderTime, timezone, 'dd.MM.yy'),
        "Time:": formatInTimeZone(sliderTime, timezone, 'HH:mm:ss'),
        "Timezone:": timezone,
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