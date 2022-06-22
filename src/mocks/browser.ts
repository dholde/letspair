import { setupWorker } from "msw";
import { restHandlers } from "./handlers";

//Sets up service worker for client requests (browser)
export const worker = setupWorker(...restHandlers);
