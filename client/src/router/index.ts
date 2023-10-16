import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import ContainerLayout from "@/components/layout/ContainerLayout.vue"
import LoginPage from "@/components/views/LoginPage.vue"
import RegisterPage from "@/components/views/RegisterPage.vue"
import StartPage from "@/components/views/StartPage.vue"
import SearchPage from "@/components/views/search/SearchPage.vue"
import GalleryViewPage from "@/components/views/GalleryViewPage.vue"
import ProctoringViewPage from "@/components/views/ProctoringViewPage.vue"
import ExamplePage from "@/components/views/ExamplePage.vue"
import UserAccountPage from "@/components/views/user-account/UserAccountPage.vue"

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
    path: "/",
    component: ContainerLayout,
    children: [
      {
        path: "/start",
        name: "StartPage",
        component: StartPage,
        beforeEnter: () => {
          // console.log("before enter")
        }
      },
      {
        path: "/example",
        name: "ExamplePage",
        component: ExamplePage
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
        path: "/userAccount",
        name: "UserAccountPage",
        component: UserAccountPage,
      }

    ]
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
