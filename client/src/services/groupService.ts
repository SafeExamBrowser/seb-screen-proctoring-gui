import axios, { AxiosResponse } from 'axios'

export async function getGroups(pageNumber?: number, pageSize?: number, filterCriteria?: string): Promise<Group[] | any> {

  try {
    //todo: add env desc to gihub

    const url: string = import.meta.env.VITE_SERVER_URL + ":" +  import.meta.env.VITE_SERVER_PORT + "/group";

    const headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const {data, status}: AxiosResponse<GroupResponse> = await axios.get(url, { headers });

    if (status === 200) {
      return data.content;
    }


  } catch (error) {
    throw error;
  }
}

export async function getGroupByUuid(uuid: string, optionalParamters?: OptionalParGroupByUuid): Promise<GroupUuidResponse[] | any> {

  try {
    //todo: add env desc to gihub
    const url: string = import.meta.env.VITE_SERVER_URL + ":" +  import.meta.env.VITE_SERVER_PORT + "/group/" + uuid;
    
    const headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const {data, status}: AxiosResponse<Group> = await axios.get(url, {headers: headers, params: {optionalParamters}});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}