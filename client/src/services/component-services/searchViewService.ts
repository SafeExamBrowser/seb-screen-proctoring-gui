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
//==============================