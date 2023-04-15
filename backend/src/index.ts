import { config } from "dotenv";
config();
import express, { Request, Response } from "express";
import { Service } from "./services/Service";
import { DraggableItemService } from "./services/DraggableItemService";
import { TaskModel, UserModel, LaneModel } from "./model";
import { Db } from "mongodb";
import { openDatabaseConnection } from "./databaseConfig";
import { json, urlencoded } from "body-parser";
import { TaskRoutes } from "./routes/taskRoutes";
import { UserRoutes } from "./routes/userRoutes";
import { LaneRoutes } from "./routes/laneRoutes";

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
    const taskRoutes = new TaskRoutes(taskService);
    app.use("/tasks", taskRoutes.get());
    laneService = new Service<LaneModel>(db.collection<LaneModel>("lanes"));
    const laneRoutes = new LaneRoutes(laneService);
    app.use("/lanes", laneRoutes.get());
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

app.get("/lanes", (req, res) => {
  res.send("GET lanes");
});

app.get("/lanes/:id", (req, res) => {
  res.send("GET lane by id");
});

app.post("/delete-item", (req, res) => {
  res.send("POST delete-item");
});
