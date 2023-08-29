import * as groupService from "@/services/api-services/groupService";
import { SortOrder } from "@/models/sortOrderEnum";
import router from "@/router";

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
export function createImageLinkWithToken(screenshots: Screenshot[] | undefined, index: number, timestamp: number): string {

    if(screenshots == null){
        return "";
    }

    const screenshotLink: string = screenshots[index].latestImageLink + "?access_token=" + localStorage.getItem("accessToken");

    if(screenshots[index].active){
        return screenshotLink + '&t=' + timestamp;
    }

    return screenshotLink;
}

export function navigateToProctoringView(screenshots: Screenshot[] | undefined, groupUuid: string, index: number) {
    if (screenshots != null) {
        router.push({
            path: "/recording/" + screenshots[index].uuid
        });
    }
}

//==============================


//=============error handling==================
export function getAlertText(groupName: string | undefined): string {
    return "The group: " + groupName + " has no recorded sessions"
}