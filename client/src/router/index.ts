import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginPage from '../components/views/LoginPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
