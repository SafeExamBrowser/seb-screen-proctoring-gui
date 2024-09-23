import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { gitTagPlugin } from "./src/plugins/vite-plugin-git-tag";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [

    vue({ 
      template: { transformAssetUrls }
    }),

    vuetify({
      autoImport: true,
    }),

    VueI18nPlugin({
      include: fileURLToPath(new URL("./src/i18n/locales/**", import.meta.url)),
    }),

    // gitTagPlugin()
  ],

  define: { 
    "process.env": {},
    _global: ({}) 
  },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    },
    
    extensions: [
      ".js",
      ".json",
      ".jsx",
      ".mjs",
      ".ts",
      ".tsx",
      ".vue",
    ],
  },

  server: {
    port: 8081,
  },

  base: "/sps-gui"

});