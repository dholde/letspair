import { setupWorker } from "msw";
// import { handlers } from "./db";
import { handlers } from "./handlers";

//Sets up service worker for client requests (browser)
export const worker = setupWorker(...handlers);
