import * as userAccountService from "@/services/api-services/userAccountService";
import { useUserAccountStore } from "@/store/app";

export async function setPersonalUserAccount(): Promise<UserAccount | null>{
    const userAccountStore = useUserAccountStore();

    try{
        if(userAccountStore.userAccount == null){
            userAccountStore.userAccount = await userAccountService.getPersonalUserAccount();

            if(userAccountStore.userAccount != null){
                return userAccountStore.userAccount;
            }
            
        }

        return userAccountStore.userAccount!;

    }catch(error){
        console.error(error);
        return null;
    }

}
