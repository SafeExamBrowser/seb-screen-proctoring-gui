export function stringToBoolean(booleanValue: string): boolean{
    if(booleanValue == "true"){
        return true;
    }

    if(booleanValue == "false"){
        return false;
    }

    return false;
}

export function createEncodedCredentials(username: string, password: string): string{
    return Buffer.from(username + ":" + password).toString("base64");
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