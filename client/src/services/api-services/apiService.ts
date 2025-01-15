import axios, { AxiosInstance } from "axios";
import * as authenticationService from "@/services/api-services/authenticationService";
import {navigateTo} from "@/router/navigation";
import * as ENV from "@/config/envConfig";
import { useLoadingStore, useAuthStore } from "@/store/store";


export let api: AxiosInstance;

export function createApi(){
    api = axios.create({
        baseURL: ENV.SERVER_URL + ENV.SERVER_PORT,
        headers: getHeaders()
    });
}

export function createApiInterceptor(){
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();

    let loadingTimer: NodeJS.Timeout | null = null;
    let loadingTimout: number = 500;
    
    let loadingEndTimer: NodeJS.Timeout | null = null;

    api.interceptors.request.use(async (config) => {

        //check if url does not need loading spinner
        const isIgnoredUrl: boolean = isUrlIgnorable(config.url);
        if(loadingStore.skipLoading || isIgnoredUrl){
            return config;
        }

        //when loading spinner should be displayed
        loadingTimer = setTimeout(() => {
            loadingStore.isLoading = true;
        }, loadingTimout);


        //until when loading spinner should be displayed (timeout)
        let loadingEndTimout: number = 20000;
        if(config.url == "/search/sessions/day") loadingEndTimout = 60000;

        loadingEndTimer = setTimeout(() => {
            resetLoadingState();
        }, loadingEndTimout);

        return config;
    });


    api.interceptors.response.use(async response => {
        resetLoadingState();
        return response;

    }, async error => {
        resetLoadingState();

        //authentication error
        const originalRequest = error.config;
        if(error.response.status === 401 && !originalRequest._retry){
            await handleAuthenticationError(originalRequest);
        }

        //general error
        throw error;
    });

    async function handleAuthenticationError(originalRequest: any){
        try{
            const response: Token = await authenticationService.refresh();

            authStore.setAccessToken(response.access_token);
            authStore.setRefreshToken(response.refresh_token);

            originalRequest._retry = true;
            originalRequest.headers = getHeaders();

            return api(originalRequest);

        }catch(error){
            let redirectRoute: string = "/";
            if(window.location.pathname != null){
                redirectRoute = window.location.pathname;
            }

            authStore.redirectRoute = redirectRoute;
            navigateTo("/");

            throw Promise.reject(error);
        }
    }


    function resetLoadingState(){
        if (loadingTimer) clearTimeout(loadingTimer); 
        if (loadingEndTimer) clearTimeout(loadingEndTimer); 

        loadingStore.isLoading = false;
        loadingStore.skipLoading = false;
    }
}

export function getHeaders(): object{
    const authStore = useAuthStore();

    return {
      "accept": "application/json",
      "Authorization": "Bearer " + authStore.getAccessToken(),
      "Content-Type": "application/x-www-form-urlencoded"
    };
}

export function getPostHeaders(): object{
    const authStore = useAuthStore();

    return {
      "accept": "application/json",
      "Authorization": "Bearer " + authStore.getAccessToken(),
      "Content-Type": "application/json"
    };
}

export function createSessionDeleteUrlSuffix(sessionUuids: string[]): string{
    let urlSuffix = "?modelIds=";

    for(let i = 0; i < sessionUuids.length; i++){
        urlSuffix += sessionUuids[i];

        if(i != sessionUuids.length-1){
            urlSuffix += "&modelIds=";
        }
    }

    return urlSuffix;
}


export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number | undefined;

    return function (...args: Parameters<T>) {
        const now = Date.now();

        if (!lastRan) {
            func(...args);
            lastRan = now;

        } else {
            clearTimeout(lastFunc);

            lastFunc = setTimeout(() => {
                if (now - lastRan! >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (now - lastRan));
        }
    };
}


function getIgnoredUrls(): string[]{
    return [
        "/screenshot/", 
        "/screenshot-data/", 
        "/screenshot-timestamps/", 
        "/search/timeline", 
        "/search/sessions",
        "/useraccount/me"
    ];
}

function isUrlIgnorable(url: string | undefined): boolean{
    if(url == null){
        return false;
    } 

    const ignoredUrls: string[] = getIgnoredUrls();

    if(url == "/search/sessions/day"){
        return false;
    }

    return ignoredUrls.some(urlFromList => url.includes(urlFromList))
}