//@ts-ignore
export const SERVER_URL = window.VITE_SERVER_URL;

//@ts-ignore
export const BASE_PATH = window.VITE_BASE_PATH;

export const SERVER_PORT = getServerPort();
function getServerPort(){
    //@ts-ignore
    if(!window.VITE_SERVER_PORT){
        return "";
    }
    //@ts-ignore
    return ":" + window.VITE_SERVER_PORT;
}