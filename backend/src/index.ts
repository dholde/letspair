import express from "express";
import { Service } from "./service";
import { UserModel } from "./model";
const app = express();
const port = 3000;

const userService = new Service<UserModel>();

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

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
