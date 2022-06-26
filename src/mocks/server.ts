import { setupServer } from "msw/node";
import { restHandlers } from "./handlers";

// Intercepts requests in node environment (used for tests)
export const server = setupServer(...restHandlers);
