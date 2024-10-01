import * as applicationService from "@/services/api-services/applicationService";
import * as timeUtils from "@/utils/timeUtils";
import * as tableUtils from "@/utils/table/tableUtils";
import {openUrlInNewTab} from "@/router/navigation";
import * as constants from "@/utils/constants";

//=============api==============
export async function searchExams(optionalParamters?: OptionalParSearchExams): Promise<Exam[] | null>{
    try{
        return await applicationService.getExamsStarted(optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}