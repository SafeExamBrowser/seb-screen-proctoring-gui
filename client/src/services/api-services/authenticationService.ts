import axios, { AxiosResponse } from 'axios'

export async function login(username: string, password: string): Promise<string | any> {

  try {
    //todo: add env desc to gihub
    const url: string = import.meta.env.VITE_SERVER_URL + ":" +  import.meta.env.VITE_SERVER_PORT + "/authorize";

    const response = await axios.post(url, {
      username,
      password
    })

    if (response.status === 200) {
      return response.data;
    } 

  } catch (error) {
    throw error;
  }
}

export async function refresh(): Promise<string | any>{

  try{
    const url: string = import.meta.env.VITE_SERVER_URL + ":" +  import.meta.env.VITE_SERVER_PORT + "/refresh";

    const headers = {
      "Authorization": "Bearer " + localStorage.getItem("refreshToken"),
    };
    
    const response: AxiosResponse<Token> = await axios.post(url, {}, {headers: headers});

    return response.data;

  }catch(error){
    throw error;
  }
}