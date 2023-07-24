import axios, { AxiosResponse } from 'axios'

export async function getSessionBySessionId(sessionId: string): Promise<Screenshot | any> {

  try {
    //todo: add env desc to gihub
    const url: string = import.meta.env.VITE_SERVER_URL + ":" +  import.meta.env.VITE_SERVER_PORT + "/session/" + sessionId;

    const headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const {data, status}: AxiosResponse<GroupResponse> = await axios.get(url, {headers});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}

export async function getSessionByTimestamp(sessionId: string, timestamp: string): Promise<Screenshot | any> {

  try {
    //todo: add env desc to gihub
    const url: string = import.meta.env.VITE_SERVER_URL + ":" +  import.meta.env.VITE_SERVER_PORT + "/session/" + sessionId + "/" + timestamp;
    
    const headers = {
        "accept": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const {data, status}: AxiosResponse<Group> = await axios.get(url, {headers: headers});

    if (status === 200) {
      return data;
    }


  } catch (error) {
    throw error;
  }
}