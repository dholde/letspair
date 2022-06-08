import { setupWorker } from "msw";
import { setupServer } from "msw/node";
import { restHandlers } from "./handlers";

// Intercepts requests in node environment (used for tests)
export const server = setupServer(...restHandlers);
//Sets up service worker for client requests (browser)
export const worker = setupWorker(...restHandlers);
