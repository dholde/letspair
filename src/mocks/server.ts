import { setupServer } from "msw/node";
import { handlers } from "./db";

// Intercepts requests in node environment (used for tests)
export const server = setupServer(...handlers);
