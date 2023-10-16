import { defineStore } from "pinia"
import { ref } from "vue";
import router from "@/router";

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

export const useLoadingStore = defineStore("loading", () => {
  const skipLoading = ref<boolean>(false);
  const isLoading = ref<boolean>(false);

  return {skipLoading, isLoading};
});

export const useAuthStore = defineStore("auth", () => {

  const accessToken = ref<string | null>();
  const refreshToken = ref<string | null>();

  function login(accessTokenString: string, refershTokenString: string){
    accessToken.value = accessTokenString;
    refreshToken.value = refershTokenString;

    router.push({
      path: "/start"
    });
  }

  function logout(){
    accessToken.value = null;
    refreshToken.value = null;

    router.push({
      path: "/"
    });
  }

  function setAccessToken(accessTokenString: string){
    accessToken.value = accessTokenString;
  }

  function setRefreshToken(refreshTokenString: string){
    refreshToken.value = refreshTokenString;
  }

  return {accessToken, refreshToken, login, logout, setAccessToken, setRefreshToken};
});