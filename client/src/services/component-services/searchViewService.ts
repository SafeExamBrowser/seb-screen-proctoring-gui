import * as searchService from "@/services/api-services/searchService";
import router from "@/router";

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

//=============window==================
export function openProctoringView(sessionId: string, timestamp?: string){

    console.log(timestamp)

    let url: string = "/recording/" + sessionId;
    
    if(timestamp){
        console.log(timestamp)
        url = "/recording/" + sessionId + "?searchTimestamp=" + timestamp;
    }

    //@ts-ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}
//==============================