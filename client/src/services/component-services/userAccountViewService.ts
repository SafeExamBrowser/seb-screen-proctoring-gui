import * as userAccountService from "@/services/api-services/userAccountService";
import { useUserAccountStore } from "@/store/store";

export async function setPersonalUserAccount(): Promise<UserAccount | null> {
    const userAccountStore = useUserAccountStore();

    try {
        if (userAccountStore.userAccount == null) {
            //request id of user first
            const accountTemp: UserAccount | null = await userAccountService.getPersonalUserAccount();
            if (accountTemp == null) {
                return null;
            }

            //request user details via id as /me sometimes caches values
            const userAccount: UserAccount | null = await userAccountService.getUserAccountById(accountTemp?.uuid);
            userAccountStore.userAccount = userAccount;

            if (userAccountStore.userAccount != null) {
                return userAccountStore.userAccount;
            }
        }

        return userAccountStore.userAccount!;

    } catch (error) {
        console.error(error);
        return null;
    }

}

//=============api==================
export async function getUserAccountById(accountId: string): Promise<UserAccount[] | any> {
    try {
        return await userAccountService.getUserAccountById(accountId)

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserAccounts(optionalParamters?: OptionalParGeneric): Promise<UserAccountResponse[] | any> {
    try {
        return await userAccountService.getUserAccounts(optionalParamters)

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function activateUserAccount(accountId: string): Promise<UserAccount | any> {
    try {
        return await userAccountService.activateUserAccount(accountId)

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deactivateUserAccount(accountId: string): Promise<UserAccount | any> {
    try {
        return await userAccountService.deactivateUserAccount(accountId)

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function changePassword(uuid: string, password: string, newPassword: string, confirmNewPassword: string): Promise<UserAccount[] | any> {
    try {
        return await userAccountService.changePassword(uuid, password, newPassword, confirmNewPassword)

    } catch (error) {
        console.error(error);
        return null;
    }
}
//==============================

export function disableEnableActionItem(action: string): boolean {
    const userAccountStore = useUserAccountStore();

    if (!userAccountStore.userAccount?.roles.includes('ADMIN')) {
        return false;
    }

    if (action == "add") {
        return false;
    }

    return !userAccountStore.isAccountSelected;
}
