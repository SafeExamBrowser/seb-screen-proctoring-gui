import vue from "@vitejs/plugin-vue"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import { createHtmlPlugin } from "vite-plugin-html";


export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
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

            createHtmlPlugin({
                inject: {
                  data: {
                    VITE_SUB_PATH: mode === "development" ? "" : process.env.VITE_SUB_PATH,
                  },
                },
            }),
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

        base: getSubPath()

    });

    function getSubPath(){
        if(process.env.VITE_SUB_PATH == null || process.env.VITE_SUB_PATH == ""){
            return "/";
        }

        return process.env.VITE_SUB_PATH;
    }
}

