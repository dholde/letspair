import express, { Request, Response } from "express";
import { Service } from "./services/Service";
import { DraggableItemService } from "./services/DraggableItemService";
import { TaskModel, UserModel, LaneModel } from "./model";
import { Db } from "mongodb";
import { openDatabaseConnection } from "./databaseConfig";
import { ObjectId } from "mongodb";

export const app = express();
const port = 3000;

let userService: DraggableItemService<UserModel>;
let taskService: DraggableItemService<TaskModel>;
let laneService: Service<LaneModel>;

async function startServer() {
  try {
    const db: Db = await openDatabaseConnection();
    userService = new DraggableItemService<UserModel>(
      db.collection<UserModel>("users")
    );
    taskService = new DraggableItemService<TaskModel>(
      db.collection<TaskModel>("tasks")
    );
    laneService = new Service<LaneModel>(db.collection<LaneModel>("lanes"));
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

app.get("/", (req: Request, res: Response) => {
  res.send("Letspair");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await userService.getItems();
    res.json(users);
  } catch (error) {
    console.error("Failed to get users", error);
    res.status(500).send("Failed to get users");
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await userService.getItemById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send(`User ${id} not found`);
    }
  } catch (error) {
    console.error(`Failed to get user ${id}`, error);
    res.status(500).send(`Failed to get user ${id}`);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  const user = req.body;
  try {
    const result = await userService.saveItem(user);
    res.json(result);
  } catch (error) {
    console.error("Failed to save user", error);
    res.status(500).send("Failed to save user");
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedUser = req.body;
  try {
    await userService.updateItem(new ObjectId(id), updatedUser);
    res.send(`User ${id} has been updated`);
  } catch (error) {
    console.error(`Failed to update user ${id}`, error);
    res.status(500).send(`Failed to update user ${id}`);
  }
});

app.post(
  "/users/handle-lane-id-update",
  async (req: Request, res: Response) => {
    const { updatedItem, oldIndexOfUpdatedItem } = req.body;
    try {
      await userService.handleDrag(updatedItem, oldIndexOfUpdatedItem);
      res.send("POST /users/handle-lane-id-update");
    } catch (error) {
      console.error("Failed to handle lane id update", error);
      res.status(500).send("Failed to handle lane id update");
    }
  }
);

app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getItems();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

app.get("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskService.getItemById(id);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve task" });
  }
});

app.post("/tasks", async (req: Request, res: Response) => {
  try {
    const task = req.body;
    const result = await taskService.saveItem(task);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

app.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTask = req.body;
    await taskService.updateItem(new ObjectId(id), updatedTask);
    res.send(`Task ${id} has been updated`);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.post(
  "/tasks/handle-lane-id-update",
  async (req: Request, res: Response) => {
    try {
      const { updatedItem, oldIndexOfUpdatedItem } = req.body;
      await userService.handleDrag(updatedItem, oldIndexOfUpdatedItem);
      res.send("POST /tasks/handle-lane-id-update");
    } catch (error) {
      res.status(500).json({ error: "Failed to handle task lane ID update" });
    }
  }
);

app.get("/lanes", (req, res) => {
  res.send("GET lanes");
});

app.get("/lanes/:id", (req, res) => {
  res.send("GET lane by id");
});

app.post("/delete-item", (req, res) => {
  res.send("POST delete-item");
});
