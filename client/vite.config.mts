// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { gitTagPlugin } from "./src/plugins/vite-plugin-git-tag";


// Utilities
import { defineConfig, loadEnv } from "vite"
import { fileURLToPath, URL } from "node:url"


// https://vitejs.dev/config/
// export default defineConfig({
export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    
    return defineConfig({
        plugins: [
            vue({ 
            template: { transformAssetUrls }
            }),
            // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
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

        base: process.env.VITE_SUB_PATH

    });
}