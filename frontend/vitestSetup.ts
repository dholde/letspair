import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/server";
import fs from "fs";
import path from "path";

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

//  Close server after all tests
afterAll(() => server.close());

const mockDataDir = path.join(__dirname, "./src/mocks");
const jsonFilePath = path.join(mockDataDir, `mockdata.json`);
beforeEach(() => {
  if (fs.existsSync(jsonFilePath)) {
    fs.unlinkSync(jsonFilePath);
  }
});

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
