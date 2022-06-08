import { createApp } from "vue";
import { createPinia } from "pinia";
// import { worker } from "./mocks/requestMocks";
// const worker = require("./mocks/requestMocks");
import { setupWorker } from "msw";
import { restHandlers } from "./mocks/handlers";

import App from "./App.vue";

if (import.meta.env.MODE === "development") {
  const worker = setupWorker(...restHandlers);
  worker.start();
}

const app = createApp(App);

app.use(createPinia());

app.mount("#app");
