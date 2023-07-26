import axios, { AxiosInstance, AxiosResponse, AxiosStatic } from "axios";
import * as authenticationService from "./authenticationService";

export let api: AxiosInstance;

export function createApi(){

    console.log("API CREATED")

    api = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL + ":" + import.meta.env.VITE_SERVER_PORT,
        headers: {
            "accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
}


// api.interceptors.response.use(response => {
//     console.log("jahahahahhaah")
//     return response;
// }, async error => {
//     console.error(error)
//     if(error.response.status === 401){

//         try{
//             const response: Token = await authenticationService.refresh();
//             localStorage.setItem("accessToken", response.access_token);
//             localStorage.setItem("refreshToken", response.refresh_token);

//             console.log(localStorage.getItem("accessToken"))

//             const originalRequest = error.config;
//             originalRequest._retry = true;

//             originalRequest.headers = {
//                 "accept": "application/json",
//                 "Authorization": "Bearer " + localStorage.getItem("accessToken"),
//                 "Content-Type": "application/x-www-form-urlencoded"
//             }

//             console.log(api(originalRequest))

//             return api(originalRequest);

//         }catch(error){
//             throw Promise.reject(error);;
//         }
        
//     }
// })
