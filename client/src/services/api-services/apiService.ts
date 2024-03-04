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
    const authStore = useAuthStore();
    const loadingStore = useLoadingStore();
    let loadingTimeout: NodeJS.Timeout | null = null;
    let loadingEndTimeout: NodeJS.Timeout | null = null;

    api.interceptors.request.use(
        async (config) => {
            if(!loadingStore.skipLoading){
                loadingTimeout = setTimeout(() => {
                    loadingStore.isLoading = true;
                }, 200);
                loadingEndTimeout = setTimeout(() => {
                    console.log("No response in 10 seconds. Most probably something went wrong.");
                    loadingStore.isLoading = false;
                }, 10000);
            }

            const ignoredRoutes: string[] = ["/screenshot", "/search/timeline", "/useraccount/me"];
            if(config.url && ignoredRoutes.includes(config.url)){
                if (loadingTimeout) clearTimeout(loadingTimeout); 
                return config;
            }

            return config;
        }
    )


    api.interceptors.response.use(async response => {
        if (loadingTimeout) clearTimeout(loadingTimeout); 
        if (loadingEndTimeout) clearTimeout(loadingEndTimeout); 
        loadingStore.isLoading = false;
        loadingStore.skipLoading = false;

        return response;

    }, async error => {
        if (loadingTimeout) clearTimeout(loadingTimeout); 
        loadingStore.isLoading = false;
        loadingStore.skipLoading = false;


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