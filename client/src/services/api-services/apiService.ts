import axios, { AxiosInstance } from "axios";
import * as authenticationService from "@/services/api-services/authenticationService";
import router from "@/router";
import * as ENV from "@/config/envConfig";
import { useLoadingStore } from "@/store/app";


export let api: AxiosInstance;

export function createApi(){
    api = axios.create({
        //todo: when env not provided
        baseURL: ENV.SERVER_URL + ENV.SERVER_PORT,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
}


export function createApiInterceptor(){
    const loadingStore = useLoadingStore();
    let loadingTimeout: NodeJS.Timeout | null = null;

    api.interceptors.request.use(
        (config) => {

            //exclude calls
            // console.log(config)
            // console.log("url: " + config.url)

            if(!loadingStore.skipLoading){
                loadingTimeout = setTimeout(() => {
                    loadingStore.isLoading = true;
                }, 1000);
            }

            return config;
        }
    )


    api.interceptors.response.use(response => {
        if (loadingTimeout) clearTimeout(loadingTimeout); 
        loadingStore.isLoading = false;
        loadingStore.skipLoading = false;

        return response;

    }, async error => {
        console.error(error)

        if (loadingTimeout) clearTimeout(loadingTimeout); 
        loadingStore.isLoading = false;
        loadingStore.skipLoading = false;


        const originalRequest = error.config;

        if(error.response.status === 401 && !originalRequest._retry){

            try{
                const response: Token = await authenticationService.refresh();
                localStorage.setItem("accessToken", response.access_token);
                localStorage.setItem("refreshToken", response.refresh_token);

                console.log(localStorage.getItem("accessToken"))

                originalRequest._retry = true;

                originalRequest.headers = {
                    "accept": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("accessToken"),
                    "Content-Type": "application/x-www-form-urlencoded"
                }

                return api(originalRequest);

            }catch(error){
                router.push({
                    path: "/"
                });

                throw Promise.reject(error);
            }
            
        }
        // else{
        //     router.push({
        //         path: "/"
        //     });
        // }
    });
}