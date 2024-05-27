import request from "supertest";
import { app, startServer } from "../src/index";
import { MongoMemoryServer } from "mongodb-memory-server";
import { ObjectId } from "mongodb";
import { setupUsersTestData } from "./testUtils";

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
  it("should delete user when sending a DELETE request", async () => {
    const response = await request(app)
      .delete(`/users/${expectedUser._id}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toMatch("OK");
  });
  // Simulates drop from user area to a lane. User's original position is index 2 in the user area, it's dropped to index 1 in lane
  it("should put users in correct order when user changed the lane", async () => {
    await setupUsersTestData();
    const response = await request(app)
      .delete(`/users/${expectedUser._id}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toMatch("OK");
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

  it("should delete task when sending a DELETE request", async () => {
    const response = await request(app)
      .delete(`/tasks/${expectedTask._id}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toMatch("OK");
  });
});

describe("The /lanes path", () => {
  let expectedLane: {
    _id?: string;
  } = {};

  it("should create a lane when called with the POST method", async () => {
    const response = await request(app).post("/lanes").send(expectedLane);
    expect(response.statusCode).toBe(200);
    const responseLane = response.body;
    expect(responseLane._id).toBeDefined();
    expectedLane._id = responseLane._id;
  });

  it("should return a lane when called with the GET method and with the path variable /:id", async () => {
    const response = await request(app).get(`/lanes/${expectedLane._id}`);
    expect(response.statusCode).toBe(200);
    const responseLane = response.body;
    expect(responseLane).toMatchObject({ _id: expectedLane._id });
  });

  it("should return a list of lanes when called with the GET method", async () => {
    const response = await request(app).get("/lanes");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    const lane = response.body[0];
    expect(lane).toMatchObject({ _id: expectedLane._id });
  });

  it("should delete lane when sending a DELETE request", async () => {
    const response = await request(app)
      .delete(`/lanes/${expectedLane._id}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.result).toMatch("OK");
  });
});
