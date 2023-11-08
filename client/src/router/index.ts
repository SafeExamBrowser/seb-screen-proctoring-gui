import { createRouter, createWebHashHistory, RouteRecordRaw, createWebHistory } from "vue-router"
import ContainerLayout from "@/components/layout/ContainerLayout.vue"
import LoginPage from "@/components/views/LoginPage.vue"
import RegisterPage from "@/components/views/RegisterPage.vue"
import StartPage from "@/components/views/StartPage.vue"
import SearchPage from "@/components/views/search/SearchPage.vue"
import GalleryViewPage from "@/components/views/gallery/GalleryViewPage.vue"
import ProctoringViewPage from "@/components/views/ProctoringViewPage.vue"
import ExamplePage from "@/components/views/ExamplePage.vue"
import UserAccountPage from "@/components/views/user-account/UserAccountPage.vue"
import UserInfo from "@/components/views/user-account/UserInfo.vue"
import * as authenticationService from "@/services/api-services/authenticationService";
import { useAuthStore } from "@/store/app";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: RegisterPage
  },
  {
    path: "/jwt",
    beforeEnter: async (to, from) => {

      const authStore = useAuthStore();

      if(to.query.token != null){
        try{
          const tokenObject: JwtTokenResponse = await authenticationService.verifyJwt(to.query.token.toString());
          authStore.loginWithJwt(tokenObject.login.access_token, tokenObject.login.refresh_token, tokenObject.redirect);

          return;

        }catch(error){
          return true;
        }
      }

      //true means redirecting to Login Page
      return true;
    },
    component: LoginPage
  },
  {
    path: "/",
    component: ContainerLayout,
    children: [
      {
        path: "/start",
        name: "StartPage",
        component: StartPage,
      },
      {
        path: "/search",
        name: "Search",
        component: SearchPage
      },
      {
        path: "/galleryView/:uuid",
        name: "GalleryViewPage",
        component: GalleryViewPage
      },
      {
        path: "/recording/:sessionId",
        name: "ProctoringViewPage",
        component: ProctoringViewPage,
      },
      {
        path: "/account",
        name: "UserAccountPage",
        component: UserAccountPage,
      },
      {
        path: "/account/:accountId",
        name: "SingleUserAccount",
        component: UserInfo
      }

    ]
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
