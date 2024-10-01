import { AxiosResponse } from 'axios'
import * as apiService from "@/services/api-services/apiService";

export async function getExamsStarted(optionalParamters?: OptionalParSearchExams): Promise<Exam[] | any> {
  try {
    const url: string = "/applications/exams-started";
    const {data, status}: AxiosResponse = await apiService.api.get(url, {headers: apiService.getHeaders(), params: {optionalParamters}});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}