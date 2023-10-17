import * as apiService from "../services/api.service";

const searchUrl: string = "/proctoring/search";

export async function searchSessions(token: string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const url: string = searchUrl + "/sessions";
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

        return data;

    }catch(error){
        apiService.handleGenericApiErrorOld(error);
    }
}


export async function searchScreenshots(token: string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        const url: string = searchUrl + "/screenshots";
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

        return data;

    }catch(error){
        apiService.handleGenericApiErrorOld(error);
    }
}

export async function searchTimeline(token: string, uuid: string, options?: {}): Promise<object>{
    try{
        //todo: add env desc to gihub
        console.log("uuid: " + uuid)
        const url: string =  searchUrl + "/timeline/" + uuid;
        const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

        return data;

    }catch(error){
        apiService.handleGenericApiErrorOld(error);
    }
}