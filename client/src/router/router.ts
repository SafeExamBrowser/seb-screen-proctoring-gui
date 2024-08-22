import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import ContainerLayout from "@/components/layout/ContainerLayout.vue";
import LoginPage from "@/components/views/LoginPage.vue";
import RegisterPage from "@/components/views/RegisterPage.vue";
import SearchPage from "@/components/views/search/SearchPage.vue";
import GalleryViewPage from "@/components/views/gallery/GalleryViewPage.vue";
import ProctoringViewPage from "@/components/views/proctoring/ProctoringViewPage.vue";
import UserAccountPage from "@/components/views/user-account/UserAccountPage.vue";
import UserInfo from "@/components/views/user-account/UserInfo.vue";
import * as authenticationService from "@/services/api-services/authenticationService";
import { useAuthStore, useSettingsStore } from "@/store/store";
import {navigateTo} from "@/router/navigation";
import * as userAccountViewService from "@/services/component-services/userAccountViewService";
import * as constants from "@/utils/constants";
import ExamsOverviewPage from "@/components/views/ExamsOverviewPage.vue";
import * as ENV from "@/config/envConfig";

const defaultPageTitle: string = " | SEB Screen Proctoring";
const routes: Array<RouteRecordRaw> = [
  {
    path: constants.DEFAULT_ROUTE,
    name: "LoginPage",
    component: LoginPage,
    meta: {requiresAuth: false},
    beforeEnter: async () => {
      const settingsStore = useSettingsStore();
      await settingsStore.setIsSebServerIntegratedMode();
    }
  },
  {
    path: constants.REGISTER_ROUTE,
    name: "RegisterPage",
    component: RegisterPage,
    meta: {requiresAuth: false},
    beforeEnter: async () => {
      const settingsStore = useSettingsStore();

      if(settingsStore.isSebServerIntegratedMode){
        navigateTo(constants.DEFAULT_ROUTE);
        return false;
      }else{
        return true;
      }
    }
  },
  {
    path: constants.JWT_LOGIN_ROUTE,
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
    path: constants.DEFAULT_ROUTE,
    component: ContainerLayout,
    meta: {requiresAuth: true},
    children: [
      {
        path: constants.RUNNING_EXAMS_ROUTE,
        name: "ExamsOverview",
        component: ExamsOverviewPage,
        meta: {
            title: "Running Exams" + defaultPageTitle
        }
      },
      {
        path: constants.SEARCH_ROUTE,
        name: "Search",
        component: SearchPage,
        meta: {
            title: "Search" + defaultPageTitle
        }
      },
      {
        path: constants.GALLERY_VIEW_ROUTE + "/:uuid",
        name: "GalleryViewPage",
        component: GalleryViewPage,
        meta: {
            title: "Gallery View" + defaultPageTitle
        }
      },
      {
        path: constants.PROCTORING_VIEW_ROUTE + "/:sessionId",
        name: "ProctoringViewPage",
        component: ProctoringViewPage,
        meta: {
            title: "Proctoring" + defaultPageTitle
        }
      },
      {
        path: constants.ACCOUNT_VIEW_ROUTE,
        name: "UserAccountPage",
        component: UserAccountPage,
        meta: {
            title: "User Accounts" + defaultPageTitle
        }
      },
      {
        path: constants.ACCOUNT_VIEW_ROUTE + "/:accountId",
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
  history: createWebHistory(ENV.BASE_PATH),
  routes
});

router.beforeEach(async (to) => {
    if(to.meta.requiresAuth){
        await userAccountViewService.setPersonalUserAccount();
    }

    const defaultTitle: string = "SEB Screen Proctoring";
    //@ts-ignore
    document.title = to.meta.title || defaultTitle;
});

export default router;