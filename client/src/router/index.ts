import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginPage from '../components/views/LoginPage.vue'
import StartPage from '../components/views/StartPage.vue'



const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/start',
    name: 'StartPage',
    component: StartPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
