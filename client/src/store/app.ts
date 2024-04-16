import { defineStore } from "pinia"
import { ref } from "vue";
import {navigateTo} from "@/router/navigation";
import * as userAccountViewService from "@/services/component-services/userAccountViewService";
import * as authenticationService from "@/services/api-services/authenticationService";
import * as settingsService from "@/services/api-services/settingsService";


//-------------------settings------------------------------//
export const useSettingsStore = defineStore("settings", () => {
  const isSebServerIntegratedMode = ref<boolean>(false);

  async function setIsSebServerIntegratedMode(){
    const settings: Settings = await settingsService.getSettings();

    if(useUserAccountStore().userAccount?.roles.includes("ADMIN")){
      useSettingsStore().isSebServerIntegratedMode = false;
      return;
    }

    if(settings != null){
      useSettingsStore().isSebServerIntegratedMode = settings.isSebServerIntegratedMode;
    }else{
      useSettingsStore().isSebServerIntegratedMode = true;
    }

  }

  return {isSebServerIntegratedMode, setIsSebServerIntegratedMode};
});

//--------------------app bar-----------------------------//
export const useAppBarStore = defineStore("appBar", () => {
    const title = ref<string>("Example Title");

    const galleryGridSize = ref<GridSize>({
        title: "3x3",
        value: 3
    });
    const galleryIsNameEnabled = ref<boolean>(true);
    const galleryIsIpEnabled = ref<boolean>(false);
    const galleryIsMetadataEnabled = ref<boolean>(false);
    const galleryCurrentPage = ref<number>(1);
    const galleryMaxPages = ref<number>(1);
    const galleryLiveSessions = ref<number>(0)
    const galleryAmountOfSessions = ref<number>(0);
    const galleryDescription = ref<string>("");

    return {
        title,      
        galleryGridSize, 
        galleryIsNameEnabled, 
        galleryIsIpEnabled, 
        galleryIsMetadataEnabled, 
        galleryCurrentPage, 
        galleryMaxPages, 
        galleryLiveSessions,
        galleryAmountOfSessions,
        galleryDescription
    };
});
//-------------------------------------------------//


//----------------------loading---------------------------//
export const useLoadingStore = defineStore("loading", () => {
  const skipLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  return {skipLoading, isLoading};
});
//-------------------------------------------------//


//----------------------authentication---------------------------//
export const useAuthStore = defineStore("auth", () => {
  const redirectRoute: string = "";

  async function login(accessTokenString: string, refershTokenString: string){
    setAccessToken(accessTokenString);
    setRefreshToken(refershTokenString);

    if(useAuthStore().redirectRoute == ""){
      navigateTo("/start");
    }else{
      navigateTo(useAuthStore().redirectRoute);
    }

    await userAccountViewService.setPersonalUserAccount();
  }

  async function loginWithJwt(accessTokenString: string, refershTokenString: string, redirect: string){
    setAccessToken(accessTokenString);
    setRefreshToken(refershTokenString);

    navigateTo(redirect);

    await userAccountViewService.setPersonalUserAccount();
  }

  async function logout(){
    await authenticationService.logLogout();
    
    setAccessToken("");
    setRefreshToken("");
    useUserAccountStore().userAccount = null;

    navigateTo("/");
  }
  
  function setAccessToken(accessTokenString: string){
    localStorage.setItem("accessToken", accessTokenString);
  }

  function getAccessToken() : string{
    const accessToken: string | null = localStorage.getItem("accessToken");
    if(accessToken == null){ return "accessToken";}
    return accessToken;
  }

  function setRefreshToken(refreshTokenString: string){
    localStorage.setItem("refreshToken", refreshTokenString);
  }

  function getRefreshToken() : string{
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    if(refreshToken == null){ return "refreshToken";}
    return refreshToken;
  }

  return {redirectRoute, login, loginWithJwt, logout, setAccessToken, getAccessToken, setRefreshToken, getRefreshToken};
});
//-------------------------------------------------//


//---------------------account----------------------------//
export const useUserAccountStore = defineStore("account", () => {
  const userAccount = ref<UserAccount | null>();
  const isEditMode = ref<boolean>();
  const isAccountSelected = ref<boolean>(false);
  const selectedAccountId = ref<number>();

  return {userAccount, isEditMode, isAccountSelected, selectedAccountId};
});
//-------------------------------------------------//

//---------------------start page----------------------------//
export const useTableStore = defineStore("table", () => {
    const isExamExpand = ref<boolean>(false);
    const isIpDisplayList = ref<{day: string, isIp: boolean}[]>([]);
  
    return {isExamExpand, isIpDisplayList};
  });
  //-------------------------------------------------//