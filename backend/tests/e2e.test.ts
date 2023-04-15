import request from "supertest";
import { app, startServer } from "../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ObjectId } from "mongodb";

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
  await server.close();
});

describe("Root path", () => {
  test("should responde to the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Letspair");
  });
});

describe("The /users path", () => {
  let expectedUser: {
    name: string;
    order: string;
    laneId: string;
    _id?: string;
  } = {
    name: "Alice",
    order: "0",
    laneId: "",
  };
  it("should should create a user when called with the POST method", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Alice", order: "0", laneId: "" });
    expect(response.statusCode).toBe(200);
    const responseUser = response.body;
    expect(responseUser).toMatchObject(expectedUser);
    expect(responseUser._id).toBeDefined();
    expectedUser._id = responseUser._id;
  });
  it("should return a user when called with the GET method and with the path variable /:id", async () => {
    const response = await request(app).get(`/users/${expectedUser._id}`);
    expect(response.statusCode).toBe(200);
    const responseUser = response.body;
    expect(responseUser).toMatchObject(expectedUser);
  });
  it("should return a list of users when called with the GET method", async () => {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    const user = response.body[0];
    expect(user).toMatchObject(expectedUser);
  });
  it("should update user when sending a PUT request", async () => {
    const updatedUser = {
      _id: expectedUser._id,
      order: 1,
      name: "New Name",
      laneId: new ObjectId().toString(),
    };
    const response = await request(app)
      .put(`/users/${expectedUser._id}`)
      .send(updatedUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(updatedUser);
  });
});

describe("The /tasks path", () => {
  let expectedTask: {
    order: number;
    laneId: string;
    description: string;
    link: string;
    linkText: string;
    _id?: string;
  } = {
    order: 0,
    laneId: "",
    description: "Task 1",
    link: "",
    linkText: "",
  };

  it("should create a task when called with the POST method", async () => {
    const response = await request(app).post("/tasks").send(expectedTask);
    expect(response.statusCode).toBe(200);
    const responseTask = response.body;
    expect(responseTask).toMatchObject(expectedTask);
    expect(responseTask._id).toBeDefined();
    expectedTask._id = responseTask._id;
  });

  it("should return a task when called with the GET method and with the path variable /:id", async () => {
    const response = await request(app).get(`/tasks/${expectedTask._id}`);
    expect(response.statusCode).toBe(200);
    const responseTask = response.body;
    expect(responseTask).toMatchObject(expectedTask);
  });

  it("should return a list of tasks when called with the GET method", async () => {
    const response = await request(app).get("/tasks");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    const task = response.body[0];
    expect(task).toMatchObject(expectedTask);
  });

  it("should update a task when sending a PUT request", async () => {
    const updatedTask = {
      _id: expectedTask._id,
      order: 1,
      laneId: "2",
      description: "Updated task description",
      link: "http://updatedlink.com",
      linkText: "Updated link",
    };
    const response = await request(app)
      .put(`/tasks/${expectedTask._id}`)
      .send(updatedTask);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject(updatedTask);
  });
});
