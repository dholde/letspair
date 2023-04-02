import express from "express";
import { Service, DraggableItemService } from "./service";
import { TaskModel, UserModel, LaneModel } from "./model";
import { Db } from "mongodb";
import { openDatabaseConnect } from "./databaseConfig";
const app = express();
const port = 3000;

let userService: DraggableItemService<UserModel>;
let taskService: DraggableItemService<TaskModel>;
let laneService: Service<LaneModel>;

async function startServer() {
  try {
    const db: Db = await openDatabaseConnect();
  } catch {
    console.error("Failed to connect to database");
    //TODO: retry
    process.exit(1);
  }
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

startServer();

app.get("/", (req, res) => {
  res.send("Letspair");
});

app.get("/users", (req, res) => {
  res.send("GET users");
});

app.get("/users/:id", (req, res) => {
  res.send("GET user by id");
});

app.post("/users", (req, res) => {
  res.send("POST");
});

app.put("/users/:id", (req, res) => {
  res.send("PUT user by id");
});

app.post("/users/handle-lane-id-update", (req, res) => {
  res.send("POST /users/handle-lane-id-update");
});

app.post("/users/handle-lane-id-update", (req, res) => {
  res.send("POST /users/handle-lane-id-update");
});

app.get("/tasks", (req, res) => {
  res.send("GET tasks");
});

app.get("/tasks/:id", (req, res) => {
  res.send("GET task by id");
});

app.post("/tasks", (req, res) => {
  res.send("POST tasks");
});

app.put("/tasks/:id", (req, res) => {
  res.send("PUT task by id");
});

app.post("/tasks/handle-lane-id-update", (req, res) => {
  res.send("POST handle-lane-id-update");
});

app.post("/task/handle-lane-id-update", (req, res) => {
  res.send("POST /task/handle-lane-id-update");
});

app.get("/lanes", (req, res) => {
  res.send("GET lanes");
});

app.get("/lanes/:id", (req, res) => {
  res.send("GET lane by id");
});

app.post("/delete-item", (req, res) => {
  res.send("POST delete-item");
});
