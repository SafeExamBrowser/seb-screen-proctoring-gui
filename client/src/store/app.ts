import { defineStore } from "pinia"
import { ref } from "vue";
import {navigateTo} from "@/router/navigation";
import * as userAccountViewService from "@/services/component-services/userAccountViewService";

//-------------------------------------------------//
export const useAppBarStore = defineStore("appBar", () => {
  const title = ref<string>("Example Title");

  const galleryGridSize = ref<GridSize>({
    title: "3x3",
    value: 3
  });
  const galleryIsNameEnabled = ref<boolean>(true);
  const galleryIsMetadataEnabled = ref<boolean>(false);
  const gallerNumberOfSessions = ref<number>(0);
  const galleryDescription = ref<string>("");

  return {title, galleryGridSize, galleryIsNameEnabled, galleryIsMetadataEnabled, gallerNumberOfSessions, galleryDescription};
});
//-------------------------------------------------//


//-------------------------------------------------//
export const useLoadingStore = defineStore("loading", () => {
  const skipLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  return {skipLoading, isLoading};
});
//-------------------------------------------------//


//-------------------------------------------------//
export const useAuthStore = defineStore("auth", () => {
  async function login(accessTokenString: string, refershTokenString: string){
    setAccessToken(accessTokenString);
    setRefreshToken(refershTokenString);

    navigateTo("/start");

   await userAccountViewService.setPersonalUserAccount();
  }

  function logout(){
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

  return {login, logout, setAccessToken, getAccessToken, setRefreshToken, getRefreshToken};
});
//-------------------------------------------------//


//-------------------------------------------------//
export const useUserAccountStore = defineStore("account", () => {
  const userAccount = ref<UserAccount | null>();
  const isEditMode = ref<boolean>();
  const isAccountSelected = ref<boolean>(false);
  const isAdminViewMode = ref<boolean>(false);


  return {userAccount, isEditMode, isAccountSelected, isAdminViewMode};
});
//-------------------------------------------------//