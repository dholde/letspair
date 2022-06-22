import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { worker } from "./mocks/browser";
if (import.meta.env.MODE === "development") {
  worker.start();
}

const app = createApp(App);

app.use(createPinia());

app.mount("#app");
