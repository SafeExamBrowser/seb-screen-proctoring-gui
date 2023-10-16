import App from "./App.vue"
import { createApp } from "vue"
import { registerPlugins } from "@/plugins"
import AlertMsg from "@/components/widgets/AlertMsg.vue";
import i18n from "./i18n";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
app.component("AlertMsg", AlertMsg);
app.use(i18n);