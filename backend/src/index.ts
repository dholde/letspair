import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import { Service } from "./services/Service";
import { DraggableItemService } from "./services/DraggableItemService";
import { TaskModel, UserModel, LaneModel } from "./model";
import { Db } from "mongodb";
import { openDatabaseConnection } from "./databaseConfig";
import { ObjectId } from "mongodb";
import { json, urlencoded } from "body-parser";
import taskRoutes from "./routes/taskRoutes";
import { UserRoutes } from "./routes/userRoutes";

export const app = express();
// app.use("/tasks", taskRoutes);
app.use(json());
app.use(urlencoded({ extended: true }));
const port = parseInt(process.env.PORT || "3000", 10);

let userService: DraggableItemService<UserModel>;
let taskService: DraggableItemService<TaskModel>;
let laneService: Service<LaneModel>;

export async function startServer() {
  try {
    const db: Db = await openDatabaseConnection();
    userService = new DraggableItemService<UserModel>(
      db.collection<UserModel>("users")
    );
    const userRoutes = new UserRoutes(userService);
    app.use("/users", userRoutes.get());
    taskService = new DraggableItemService<TaskModel>(
      db.collection<TaskModel>("tasks")
    );
    laneService = new Service<LaneModel>(db.collection<LaneModel>("lanes"));
  } catch (error) {
    console.error("Failed to connect to database");
    //TODO: retry
    process.exit(1);
  }
  return app.listen(port, () => {
    console.log(`Express is listening at http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

app.get("/", (req: Request, res: Response) => {
  res.send("Letspair");
});

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
