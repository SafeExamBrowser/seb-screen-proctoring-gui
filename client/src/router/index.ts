import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import ContainerLayout from "../components/layout/ContainerLayout.vue"
import LoginPage from "../components/views/LoginPage.vue"
import StartPage from "../components/views/StartPage.vue"
import GalleryViewPage from "../components/views/GalleryViewPage.vue"
import DummyPage from "../components/views/DummyPage.vue"


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
        name: "Start",
        component: StartPage,
        beforeEnter: () => {
          console.log("before enter")
        }
      },
      {
        path: "/dummy",
        name: "Dummy",
        component: DummyPage
      },
      {
        path: "/galleryView/:uuid",
        name: "GalleryViewPage",
        component: GalleryViewPage
      }

    ]
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
