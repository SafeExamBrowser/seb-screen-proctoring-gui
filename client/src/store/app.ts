// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useTitleStore = defineStore('title', () => {
  const title = ref("Example Title");

  return {title};
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