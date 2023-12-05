import * as groupService from "@/services/api-services/groupService";
import * as screenshotDataService from "@/services/api-services/screenshotDataService";
import { SortOrder } from "@/models/sortOrderEnum";
import {navigateTo} from "@/router/navigation";
import { useAuthStore } from "@/store/app";

//=============api==============
export async function getGroup(groupUuid: string, currentWindow: number, pageSize: number): Promise<GroupUuid | null>{
    try {
        const groupUuidResponse = await groupService.getGroupByUuid(groupUuid, 
            {   
                sortOrder: SortOrder.desc,
                pageNumber: currentWindow+=1, 
                pageSize: Math.pow(pageSize, 2)
            }
        );

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
//==============================


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
//==============================

//=============links============
// export function getLatestImageLink(screenshot: ScreenshotData | undefined, timestamp: number): string {
//     const authStore = useAuthStore();

//     if(screenshot == null){
//         return "";
//     }

//     const screenshotLink: string = screenshot.latestImageLink + "?access_token=" + authStore.getAccessToken();

//     if(screenshot.active){
//         return screenshotLink + '&t=' + timestamp;
//     }

//     return screenshotLink;
// }

export function navigateToProctoringView(screenshot: ScreenshotData | undefined, groupUuid: string) {
    if (screenshot != null) {
        navigateTo("/recording/" + screenshot.uuid);
    }
}
//==============================

//=============metadata=========
export function getScreenshotMetadata(currentScreenshotMetadata: MetaData | null | undefined): object{
    return {
        "Url:": currentScreenshotMetadata?.screenProctoringMetadataURL,
        "Window Title:": currentScreenshotMetadata?.screenProctoringMetadataWindowTitle,
        "User-Action:": currentScreenshotMetadata?.screenProctoringMetadataUserAction,
    };
}
//==============================