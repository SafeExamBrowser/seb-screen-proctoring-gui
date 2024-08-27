// Plugins
import vue from "@vitejs/plugin-vue"
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { gitTagPlugin } from "./src/plugins/vite-plugin-git-tag";
import fs from "fs/promises";

// Utilities
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";


export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
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

            {
                name: 'index-html-env',
                async transformIndexHtml() {
                if (process.env.NODE_ENV !== 'production') {
                    return await fs.readFile('index.dev.html', 'utf8')
                }
                }
            },

            // gitTagPlugin()
        ],

        base: process.env.VITE_BASE_PATH,    

        build: {
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                onwarn(warning, warn) {
                    if (warning.code === 'UNRESOLVED_IMPORT') {
                        return;  // Ignore this specific warning
                    }
                    // Use default behavior for other warnings
                    warn(warning);
                },
            }
        },

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

    });
}