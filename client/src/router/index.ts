import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import ContainerLayout from "../components/layout/ContainerLayout.vue"
import LoginPage from "../components/views/LoginPage.vue"
import StartPage from "../components/views/StartPage.vue"
import GalleryViewPage from "../components/views/GalleryViewPage.vue"
import ProctoringViewPage from "../components/views/ProctoringViewPage.vue"
import ExamplePage from "../components/views/ExamplePage.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "LoginPage",
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
        path: "/galleryView/:uuid",
        name: "GalleryViewPage",
        component: GalleryViewPage
      },
      {
        path: "/galleryView/:uuid/recording/:sessionId",
        name: "ProctoringViewPage",
        component: ProctoringViewPage
      }

    ]
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
