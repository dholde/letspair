import { setupWorker } from "msw";
import { handlers } from "./db";

//Sets up service worker for client requests (browser)
export const worker = setupWorker(...handlers);
