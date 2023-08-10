//@ts-ignore
export const SERVER_URL = window.VITE_SERVER_URL;
export const SERVER_PORT = getServerPort();

console.log("SERVER_URL: " + SERVER_URL)
console.log("SERVER_PORT: " + SERVER_PORT)

function getServerPort(){
    //@ts-ignore
    if(!window.VITE_SERVER_PORT){
        return "";
    }
    //@ts-ignore
    return ":" + window.VITE_SERVER_PORT;
};