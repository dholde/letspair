import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./server";

// Start server before all tests
beforeAll(() => {
  console.log("Service WEB WORKER BEFORE ALL");
  server.listen({ onUnhandledRequest: "error" });
});

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
