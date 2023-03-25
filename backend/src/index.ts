import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Letspair");
});

app.get("/users", (req, res) => {
  res.send("GET users");
});

app.get("/users/:id", (req, res) => {
  res.send("GET user by id");
});

app.get("/tasks", (req, res) => {
  res.send("GET tasks");
});

app.get("/tasks/:id", (req, res) => {
  res.send("GET task by id");
});

app.get("/lanes", (req, res) => {
  res.send("GET lanes");
});

app.get("/lanes/:id", (req, res) => {
  res.send("GET lane by id");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
