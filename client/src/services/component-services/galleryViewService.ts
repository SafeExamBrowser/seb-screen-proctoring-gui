import * as groupService from "@/services/api-services/groupService";
import { SortOrder } from "@/models/sortOrderEnum";

//=============api==================
export async function getGroup(groupUuid: string, currentWindow: number, pageSize: number): Promise<GroupUuid | null>{
    try {
        const groupUuidResponse = await groupService.getGroupByUuid(groupUuid, 
            {   
                sortOrder: SortOrder.desc,
                pageNumber: (currentWindow == 0) ? 1 : currentWindow, 
                pageSize: Math.pow(pageSize, 2)
            }
        );

        console.log("====response====")
        console.log(groupUuidResponse)
        console.log("===========")

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
    if (screenshots != null && screenshots.length > index) {
        return true;
    }

    return false;
}


//=============image link==================
export function createImageLinkWithToken(screenshots: Screenshot[] | undefined, index: number): string {
    if (screenshots != null) {
        return screenshots[index].latestImageLink + "?access_token=" + localStorage.getItem("accessToken");
    }

    return "";
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