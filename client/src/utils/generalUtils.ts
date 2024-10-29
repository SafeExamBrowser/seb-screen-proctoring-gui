export function createStringIdList(ids: number[]): string{
    let stringIdList = "";
    if(ids.length == 0){
        return stringIdList;
    }

    for(let i = 0; i < ids.length; i++){
        stringIdList += ids[i] + ","
    }

    stringIdList = stringIdList.substring(0, stringIdList.length-1);

    return stringIdList
}