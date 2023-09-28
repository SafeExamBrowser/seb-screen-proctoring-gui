import * as searchService from "@/services/api-services/searchService";
import * as timeUtils from "@/utils/timeUtils";


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

//=============grouping==================
export function groupSessionsByDay(sessionSearchResults: SearchSessions): SessionsGrouped{
    var sessionsGrouped: SessionsGrouped = {
        numberOfPages: sessionSearchResults.numberOfPages,
        pageNumber: sessionSearchResults.pageNumber,
        pageSize: sessionSearchResults.pageSize,
        sort: sessionSearchResults.sort,
        content: [
            {
                day: "",
                sessions: []
            }
        ]
    };

    const uniqueDaysSet: Set<string> = new Set(
        sessionSearchResults.content.map(
            session => timeUtils.formatTimestmapToDate(session.startTime)
        )
    );
    const uniqueDays: string[] = [...uniqueDaysSet];

    const dayToIndexMap: {[day: string]: number} = {};

    for(var i = 0; i < uniqueDays.length; i++){
        sessionsGrouped.content[i] = {
            day: uniqueDays[i],
            sessions: []
        }
        dayToIndexMap[uniqueDays[i]] = i;
    }

    for(var i = 0; i < sessionSearchResults.content.length; i++){
        const day = timeUtils.formatTimestmapToDate(sessionSearchResults.content[i].startTime);
        const index = dayToIndexMap[day];
        if (index !== undefined) {
            sessionsGrouped.content[index].sessions.push(sessionSearchResults.content[i]);
        }
    }

    return sessionsGrouped;
}





//todo: improve this function
export function groupScreenshotsByMetadata(screenshotGroupList: ScreenshotGroup[]): ScreenshotsGrouped[] | null{

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
//==============================