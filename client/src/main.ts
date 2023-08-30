import "@/assets/css/main.scss";
import App from "./App.vue"
import { createApp } from "vue"
import { registerPlugins } from "@/plugins"
import AlertMsg from "@/components/widgets/AlertMsg.vue";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
app.component("AlertMsg", AlertMsg);