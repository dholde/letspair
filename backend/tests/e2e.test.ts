import request from "supertest";
import { app } from "../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

beforeAll(async () => {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.DB_URL = uri;
});

afterAll(async () => {
  await mongod.stop();
});

describe("Test the root path", () => {
  test("It should respond to the GET method", async (done) => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello World!");
    done();
  });
});

describe("Test the /users path", () => {
  test("It should respond to the GET method", async (done) => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
    done();
  });

  test("It should respond to the POST method", async (done) => {
    const response = await request(app)
      .post("/users")
      .send({ id: 3, name: "Charlie" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 3, name: "Charlie" });
    done();
  });
});
