import { setupServer } from "msw/node";
// import { handlers } from "./db";
import { handlers } from "./handlers";

// Intercepts requests in node environment (used for tests)
export const server = setupServer(...handlers);
