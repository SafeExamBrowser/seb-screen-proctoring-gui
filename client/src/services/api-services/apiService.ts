import axios, { AxiosInstance } from "axios";
import * as authenticationService from "@/services/api-services/authenticationService";
import {navigateTo} from "@/router/navigation";
import * as ENV from "@/config/envConfig";
import { useLoadingStore, useAuthStore } from "@/store/app";
import router from "@/router";


export let api: AxiosInstance;

export function createApi(){
    api = axios.create({
        baseURL: ENV.SERVER_URL + ENV.SERVER_PORT,
        headers: getHeaders()
    });
}

export function createApiInterceptor(){
    const ignoredUrls: string[] = getIgnoredUrls();

    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();

    let loadingTimeout: NodeJS.Timeout | null = null;
    let loadingEndTimeout: NodeJS.Timeout | null = null;

    api.interceptors.request.use(async (config) => {
        //additional skip when url is used multiple times in differnet locations such as /group
        if(!loadingStore.skipLoading && !loadingStore.isSessionsSearch){
            loadingTimeout = setTimeout(() => {
                loadingStore.isLoading = true;
            }, 500);

            loadingEndTimeout = setTimeout(() => {
                resetLoadingState();
            }, 10000);
        }

        if(loadingStore.isSessionsSearch){
            loadingEndTimeout = setTimeout(() => {
                loadingStore.isLoading = false;
                loadingStore.isTimeout = true;
                loadingStore.isSessionsSearch = false;
            }, 15000);
        }

        const isIgnoredUrl: boolean = ignoredUrls.some(url => config.url?.includes(url));
        if(isIgnoredUrl){
            if (loadingTimeout) clearTimeout(loadingTimeout); 
            return config;
        }

        return config;
    });


    api.interceptors.response.use(async response => {
        if(loadingStore.isSessionsSearch){
            if (loadingEndTimeout) clearTimeout(loadingEndTimeout); 
        }else{
            resetLoadingState();
        }

        return response;

    }, async error => {
        resetLoadingState();

        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry){

            try{
                const response: Token = await authenticationService.refresh();
                authStore.setAccessToken(response.access_token);
                authStore.setRefreshToken(response.refresh_token);

                originalRequest._retry = true;
                originalRequest.headers = getHeaders();

                return api(originalRequest);

            }catch(error){
                authStore.redirectRoute = router.currentRoute.value.fullPath;

                navigateTo("/");

                throw Promise.reject(error);
            }
            
        }
    });


    function resetLoadingState(){
        if(loadingStore.isSessionsSearch){
            return;
        }

        if (loadingTimeout) clearTimeout(loadingTimeout); 
        if (loadingEndTimeout) clearTimeout(loadingEndTimeout); 

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

function getIgnoredUrls(): string[]{
    return [
        "/screenshot/", 
        "/screenshot-data/", 
        "/screenshot-timestamps/", 
        "/search/timeline", 
        "/useraccount/me"
    ];
}