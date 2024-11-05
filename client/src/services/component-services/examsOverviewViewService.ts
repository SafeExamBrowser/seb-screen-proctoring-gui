import * as groupService from "@/services/api-services/groupService";
import * as constants from "@/utils/constants";

//=============api==============
export async function getGroups(optionalParamters?: OptionalParGroups): Promise<GroupObject | null>{
    try{
        return await groupService.getGroups(optionalParamters); 
    }catch(error){
        console.error("it got here view service")
        console.error(error);
        return null;
    }
}