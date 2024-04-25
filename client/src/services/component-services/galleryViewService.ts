import * as groupService from "@/services/api-services/groupService";
import * as screenshotDataService from "@/services/api-services/screenshotDataService";
import { SortOrder } from "@/models/sortOrderEnum";
import {openUrlInNewTab} from "@/router/navigation";
import * as metadataUtils from "@/utils/metadataUtils";

//=============api==============
export async function getGroup(groupUuid: string, currentWindow: number, pageSize: number): Promise<GroupUuid | null>{
    try {
        const groupUuidResponse: GroupUuid = await groupService.getGroupByUuid(groupUuid, 
            {   
                // sortOrder: SortOrder.asc,
                // sortBy: "clientName",
                pageNumber: currentWindow+=1, 
                pageSize: Math.pow(pageSize, 2)
            }
        );

        // groupUuidResponse.screenshots = filterLiveSessions(groupUuidResponse.screenshots);

        return groupUuidResponse;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getLatestScreenshotData(sessionUuid: string, timestamp: number): Promise<ScreenshotData | null>{
    try{
        return await screenshotDataService.getScreenshotDataByTimestamp(sessionUuid, timestamp.toString());        
    }catch(error){
        console.error(error);
        return null;
    }
}

//===========filter=========
export function filterLiveSessions(screenshotData: ScreenshotData[]): ScreenshotData[]{
    const screenshotDataOnlyLive: ScreenshotData[] = screenshotData.filter((screenshot) => {
        return screenshot.active;
    }); 

    return screenshotDataOnlyLive;
}

//=============index============
export function calcIndex(i: number, n: number, gridSize: number): number {
    return ((i - 1) * gridSize + (n - 1));
}

export function currentIndexExists(screenshots: ScreenshotData[] | undefined, index: number): boolean {
    if (screenshots != null && screenshots.length > index) {
        return true;
    }

    return false;
}

//=============links============
export function navigateToProctoringView(screenshot: ScreenshotData | undefined, groupUuid: string) {
    if (screenshot != null) {
        openUrlInNewTab("/recording/" + screenshot.uuid);
    }
}

//=============metadata=========
export function getScreenshotMetadata(currentScreenshotMetadata: MetaData | null | undefined): object{
    return {
        "Url:": currentScreenshotMetadata?.screenProctoringMetadataURL,
        "Window Title:": currentScreenshotMetadata?.screenProctoringMetadataWindowTitle,
        //temp solution
        "Activity Details:": metadataUtils.filterOutLetters(currentScreenshotMetadata?.screenProctoringMetadataUserAction)
    };
}