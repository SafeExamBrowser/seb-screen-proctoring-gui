// Utilities
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue';

export const useAppBarStore = defineStore('appBar', () => {
  const title = ref<string>("Example Title");
  const galleryGridSize = ref<GridSize>({
    title: "3x3",
    value: 3
  });
  const isNameEnabled = ref<boolean>(true);

  return {title, galleryGridSize, isNameEnabled};
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