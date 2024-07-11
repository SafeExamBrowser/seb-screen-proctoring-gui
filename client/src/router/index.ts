import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router"
import ContainerLayout from "@/components/layout/ContainerLayout.vue"
import LoginPage from "@/components/views/LoginPage.vue"
import RegisterPage from "@/components/views/RegisterPage.vue"
import StartPage from "@/components/views/StartPage.vue"
import SearchPage from "@/components/views/search/SearchPage.vue"
import GalleryViewPage from "@/components/views/gallery/GalleryViewPage.vue"
import ProctoringViewPage from "@/components/views/proctoring/ProctoringViewPage.vue"
import UserAccountPage from "@/components/views/user-account/UserAccountPage.vue"
import UserInfo from "@/components/views/user-account/UserInfo.vue"
import * as authenticationService from "@/services/api-services/authenticationService";
import { useAuthStore, useSettingsStore } from "@/store/app";
import {navigateTo} from "@/router/navigation";
import * as userAccountViewService from "@/services/component-services/userAccountViewService";

const defaultPageTitle: string = " | SEB Screen Proctoring";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "LoginPage",
    component: LoginPage,
    meta: {requiresAuth: false},
    beforeEnter: async () => {
      const settingsStore = useSettingsStore();
      await settingsStore.setIsSebServerIntegratedMode();
    }
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: RegisterPage,
    meta: {requiresAuth: false},
    beforeEnter: async () => {
      const settingsStore = useSettingsStore();

      if(settingsStore.isSebServerIntegratedMode){
        navigateTo("/");
        return false;
      }else{
        return true;
      }
    }
  },
  {
    path: "/jwt",
    meta: {requiresAuth: false},
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
    meta: {requiresAuth: true},
    children: [
      {
        path: "/start",
        name: "StartPage",
        component: StartPage,
        meta: {
            title: "Start Page" + defaultPageTitle
        }
      },
      {
        path: "/search",
        name: "Search",
        component: SearchPage,
        meta: {
            title: "Search" + defaultPageTitle
        }
      },
      {
        path: "/galleryView/:uuid",
        name: "GalleryViewPage",
        component: GalleryViewPage,
        meta: {
            title: "Gallery View" + defaultPageTitle
        }
      },
      {
        path: "/recording/:sessionId",
        name: "ProctoringViewPage",
        component: ProctoringViewPage,
        meta: {
            title: "Proctoring" + defaultPageTitle
        }
      },
      {
        path: "/account",
        name: "UserAccountPage",
        component: UserAccountPage,
        meta: {
            title: "User Accounts" + defaultPageTitle
        }
      },
      {
        path: "/account/:accountId",
        name: "SingleUserAccount",
        component: UserInfo,
        meta: {
            title: "User Account" + defaultPageTitle
        }
      }

    ]
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  if(to.meta.requiresAuth){
    const settingsStore = useSettingsStore();

    await userAccountViewService.setPersonalUserAccount();
    await settingsStore.setIsSebServerIntegratedMode();
  }

  const defaultTitle: string = "SEB Screen Proctoring";
  //@ts-ignore
  document.title = to.meta.title || defaultTitle;
});

export default router;