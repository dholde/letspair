import request from "supertest";
import { app, startServer } from "../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;
let server;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.DB_URL = uri;
  server = await startServer();
  await new Promise<void>((resolve, reject) => {
    server.on("listening", () => {
      console.log("Server is ready!");
      resolve();
    });
    server.on("error", (err) => {
      reject(err);
    });
  });
}, 40000);

afterAll(async () => {
  await mongod.stop();
  server.close();
});

describe("Test the root path", () => {
  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Letspair");
  });
});

describe("Test the /users path", () => {
  test("It should respond to the POST method", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Alice", order: "0", laneId: "" });
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      name: "Alice",
      order: "0",
      laneId: "",
    });
  });
  test("It should respond to the GET method", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ _id: 1, name: "Alice" }]);
  });
});
