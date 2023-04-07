import { request } from "supertest";
import { app } from "../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  process.env.DB_URL = mongoUri;
});

afterAll(async () => {
  await mongoServer.stop();
});

describe("Test the root path", () => {
  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});

describe("Test the /users path", () => {
  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });

  test("It should respond to the POST method", async () => {
    const response = await request(app)
      .post("/users")
      .send({ id: 3, name: "Charlie" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 3, name: "Charlie" });
  });
});
