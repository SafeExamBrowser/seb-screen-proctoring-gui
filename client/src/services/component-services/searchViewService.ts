import * as searchService from "@/services/api-services/searchService";


//=============api==================
export async function searchSessions(optionalParamters?: OptionalParSearchSessions): Promise<SearchSessions | null>{
    try{
        return await searchService.searchSessions(optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function searchScreenshots(optionalParamters?: OptionalParSearchScreenshots): Promise<SearchScreenshots | null>{
    try{
        return await searchService.searchScreenshots(optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function searchTimeline(sessionId: string, optionalParamters?: OptionalParSearchTimeline): Promise<SearchTimeline | null>{
    try{
        return await searchService.searchTimeline(sessionId, optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}
//==============================

export function groupScreenshotsByMetadata(screenshotGroupList: ScreenshotGroupList[]): ScreenshotsGrouped[] | null{

    //todo: extract metadata from par
    // const metadataGroupPar: string = "screenProctoringMetadataUserAction"

    if(screenshotGroupList == null || screenshotGroupList.length == 0){
        return null;
    }

    let groups: ScreenshotsGrouped[] = [];

    let currentGroup: ScreenshotsGrouped = {
        groupName: screenshotGroupList[0].metaData.screenProctoringMetadataUserAction!, 
        timelineScreenshotDataList: [
            {
                timestamp: screenshotGroupList[0].timestamp,
                metaData: screenshotGroupList[0].metaData
            }
        ]
    };

    if(screenshotGroupList.length !< 0){
        return null;
    }

    for(let i = 1; i < screenshotGroupList.length; i++){

        if(currentGroup.groupName == screenshotGroupList[i].metaData.screenProctoringMetadataUserAction){
            currentGroup.timelineScreenshotDataList.push(screenshotGroupList[i]);

        }else{
            groups.push(currentGroup);

            currentGroup = {
                groupName: screenshotGroupList[i].metaData.screenProctoringMetadataUserAction!,
                timelineScreenshotDataList: [
                    {
                        timestamp: screenshotGroupList[i].timestamp,
                        metaData: screenshotGroupList[i].metaData
                    }
                ]
            }
        }
    }

    if(!groups.includes(currentGroup)){
        groups.push(currentGroup);
    }

    return groups;
}