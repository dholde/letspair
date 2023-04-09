import request from "supertest";
import { app } from "../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  //process.env.DB_URL = uri;
});

afterAll(async () => {
  await mongod.stop();
});

describe("Test the root path", () => {
  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Letspair");
  });
});

test("It should respond to the POST method", async () => {
  const response = await request(app).post("/users").send({ name: "Alice" });
  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({ name: "Alice" });
});

describe("Test the /users path", () => {
  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ _id: 1, name: "Alice" }]);
  });
});
