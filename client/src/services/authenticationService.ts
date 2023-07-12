import axios, { AxiosResponse } from 'axios'

export async function login(username: string, password: string): Promise<string | any> {

  try {
    //todo: add env desc to gihub
    const response: AxiosResponse<Token> = await axios.post(process.env.VUE_APP_SERVER_URL + ":" +  process.env.VUE_APP_SERVER_PORT + "/authorize", {
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