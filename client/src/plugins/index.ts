
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import * as apiService from "@/services/api-services/apiService";

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  apiService.createApi();
  apiService.createApiInterceptor();
  
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
}
