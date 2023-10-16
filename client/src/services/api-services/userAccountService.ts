import axios from "axios";
;import * as ENV from "@/config/envConfig";

export async function register(
  name: string,
  surname: string,
  username: string,
  newPassword: string,
  confirmNewPassword: string,
  email?: string,
  timeZone?: string,
): Promise<string | any> {

  try {
    const url: string = ENV.SERVER_URL + ENV.SERVER_PORT + "/useraccount/register";

    const response = await axios.post(url, {
      name,
      surname,
      username,
      newPassword,
      confirmNewPassword,
      email,
      timeZone
    });

    if (response.status === 200) {
      return response.data;
    } 

  } catch (error) {
    throw error;
  }
}