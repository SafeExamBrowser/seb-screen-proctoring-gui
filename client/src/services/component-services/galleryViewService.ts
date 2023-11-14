import * as groupService from "@/services/api-services/groupService";
import * as sessionService from "@/services/api-services/sessionService";
import { SortOrder } from "@/models/sortOrderEnum";
import {navigateTo} from "@/router/navigation";
import { useAuthStore } from "@/store/app";

//=============api==================
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

export async function getLatestScreenshotData(sessionUuid: string, timestamp: number): Promise<Screenshot | null>{
    try{
        return await sessionService.getSessionByTimestamp(sessionUuid, timestamp.toString());        
    }catch(error){
        console.error(error);
        return null;
    }
}
//==============================


//=============index==================
export function calcIndex(i: number, n: number, gridSize: number): number {
    return ((i - 1) * gridSize + (n - 1));
}

export function currentIndexExists(screenshots: Screenshot[] | undefined, index: number): boolean {

    if (screenshots != null && screenshots.length > index) {
        return true;
    }

    return false;
}
//==============================


//=============links==================
// export function createImageLinkWithToken(screenshots: Screenshot[] | undefined, index: number, timestamp: number): string {
//     const authStore = useAuthStore();

//     if(screenshots == null){
//         return "";
//     }

//     const screenshotLink: string = screenshots[index].latestImageLink + "?access_token=" + authStore.getAccessToken();

//     if(screenshots[index].active){
//         return screenshotLink + '&t=' + timestamp;
//     }

//     return screenshotLink;
// }

export function createImageLinkWithToken(screenshot: Screenshot | undefined, timestamp: number): string {
    const authStore = useAuthStore();

    if(screenshot == null){
        return "";
    }

    const screenshotLink: string = screenshot.latestImageLink + "?access_token=" + authStore.getAccessToken();

    if(screenshot.active){
        return screenshotLink + '&t=' + timestamp;
    }

    return screenshotLink;
}


// export function navigateToProctoringView(screenshots: Screenshot[] | undefined, groupUuid: string, index: number) {
//     if (screenshots != null) {
//         navigateTo("/recording/" + screenshots[index].uuid);
//     }
// }

export function navigateToProctoringView(screenshot: Screenshot | undefined, groupUuid: string) {
    if (screenshot != null) {
        navigateTo("/recording/" + screenshot.uuid);
    }
}
//==============================

//=============metadata==================
export function getScreenshotMetadata(currentScreenshotMetadata: MetaData | null | undefined): object{
    return {
        "Url:": currentScreenshotMetadata?.screenProctoringMetadataURL,
        "Window Title:": currentScreenshotMetadata?.screenProctoringMetadataWindowTitle,
        "User-Action:": currentScreenshotMetadata?.screenProctoringMetadataUserAction,
    };
}
//==============================