
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import * as apiService from "@/services/api-services/apiService";
import type { App } from 'vue'
import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export function registerPlugins (app: App) {
  apiService.createApi();
  apiService.createApiInterceptor();
  
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(LoadingPlugin)
}
