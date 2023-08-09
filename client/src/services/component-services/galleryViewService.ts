import * as groupService from "@/services/api-services/groupService";
import { SortOrder } from "@/models/sortOrderEnum";

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
        //todo: add proper error handling

    } catch (error) {
        //todo: add better error handling
        console.error(error);
        return null;
    }
}


//=============index==================
export function calcIndex(i: number, n: number, gridSize: number): number {
    return ((i - 1) * gridSize + (n - 1));
}

export function currentIndexExists(screenshots: Screenshot[] | undefined, index: number): boolean {

    // console.log("current index: " + index)


    if (screenshots != null && screenshots.length > index) {
        return true;
    }

    return false;
}


//=============links==================
export function createImageLinkWithToken(screenshots: Screenshot[] | undefined, index: number, timestamp: number): string {

    if(screenshots == null){
        return "";
    }

    let screenshotLink: string = screenshots[index].latestImageLink + "?access_token=" + localStorage.getItem("accessToken");

    if(screenshots[index].active){
        return screenshotLink + '&t=' + timestamp;
    }

    return screenshotLink;
}

export function getProctoringViewLink(screenshots: Screenshot[] | undefined, groupUuid: string, index: number): string {
    if (screenshots != null) {
        return "/galleryView/" + groupUuid + "/recording/" + screenshots[index].uuid;
    }

    return "";
}

//=============error handling==================
export function getAlertText(groupName: string | undefined): string {
    return "The group: " + groupName + " has no recorded sessions"
}