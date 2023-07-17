import axios, { AxiosResponse } from 'axios'

export async function login(username: string, password: string): Promise<string | any> {

  try {
    //todo: add env desc to gihub
    const url: string = import.meta.env.VITE_SERVER_URL + ":" +  import.meta.env.VITE_SERVER_PORT + "/authorize";
    console.log("url: " + url)

    const response: AxiosResponse<Token> = await axios.post(url, {
      username,
      password
    })

    console.log(response)

    if (response.status === 200) {
      return response.data.access_token;
    }


  } catch (error) {
    throw error;
  }
}