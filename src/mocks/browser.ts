import { setupWorker } from "msw";
import { restHandlers } from "./handlers";
import { handlers } from "./db";

//Sets up service worker for client requests (browser)
export const worker = setupWorker(...handlers);
