// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useAppBarStore = defineStore('appBar', () => {
  const title = ref<string>("Example Title");

  const galleryGridSize = ref<GridSize>({
    title: "3x3",
    value: 3
  });
  const galleryIsNameEnabled = ref<boolean>(true);
  const gallerNumberOfSessions = ref<number>(0);
  const galleryDescription = ref<string>("");

  return {title, galleryGridSize, galleryIsNameEnabled, gallerNumberOfSessions, galleryDescription};
});

export const useLoadingStore = defineStore("loading", () => {
  const isLoading = ref<boolean>(false);

  return {isLoading};
});

// export const useAuthStore = defineStore("auth", () => {

//   const accessToken = ref<string | null>();
//   const refreshToken = ref<string | null>();

//   function login(accessTokenString: string, refershTokenString: string){
//     accessToken.value = accessTokenString;
//     refreshToken.value = refershTokenString;
//   }

//   function logout(){
//     accessToken.value = null;
//     refreshToken.value = null;
//   }

//   function setAccessToken(accessTokenString: string){
//     accessToken.value = accessTokenString;
//   }

//   function setRefreshToken(refreshTokenString: string){
//     refreshToken.value = refreshTokenString;
//   }

//   return {accessToken, refreshToken, login, logout, setAccessToken, setRefreshToken};
// });