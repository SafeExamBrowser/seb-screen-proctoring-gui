export const PROCTOR_SERVER_URL = process.env.PROCTOR_SERVER_URL;
export const PROCTOR_SERVER_PORT = getServerPort();
export const PROCTOR_DEFAULT_URL = process.env.PROCTOR_DEFAULT_URL;

export const NODE_ENV = process.env.NODE_ENV;
export const SERVER_PORT = process.env.SERVER_PORT || "";

export const DEV_SERVER_URL = process.env.DEV_SERVER_URL;
export const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT;

export const PROCTOR_SERVER_USERNAME = process.env.PROCTOR_SERVER_USERNAME;
export const PROCTOR_SERVER_PASSWORD = process.env.PROCTOR_SERVER_PASSWORD;

export const SEB_SERVER_INTEGRATED_MODE = process.env.SEB_SERVER_INTEGRATED_MODE;

export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

function getServerPort(){
    if(!process.env.PROCTOR_SERVER_PORT){
        return "";
    }
    return ":" + process.env.PROCTOR_SERVER_PORT;
};