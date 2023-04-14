import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DraggableItemService } from "../services/DraggableItemService";
import { TaskModel } from "../model";

export class TaskRoutes {
  private taskService: DraggableItemService<TaskModel>;
  private router: Router;
  constructor(taskService: DraggableItemService<TaskModel>) {
    this.taskService = taskService;
    this.router = Router();
  }

  get(): Router {
    this.configureRoutes();
    return this.router;
  }

  configureRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const tasks = await this.taskService.getItems();
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve tasks" });
      }
    });

    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const task = await this.taskService.getItemById(id);
        if (!task) {
          res.status(404).json({ error: "Task not found" });
          return;
        }
        res.json(task);
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve task" });
      }
    });

    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const task = req.body;
        const result = await this.taskService.saveItem(task);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to save task" });
      }
    });

    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const updatedTask = req.body;
        await this.taskService.updateItem(new ObjectId(id), updatedTask);
        res.send(`Task ${id} has been updated`);
      } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
      }
    });

    this.router.post(
      "/handle-lane-id-update",
      async (req: Request, res: Response) => {
        try {
          const { updatedItem, oldIndexOfUpdatedItem } = req.body;
          await this.taskService.handleDrag(updatedItem, oldIndexOfUpdatedItem);
          res.send("POST /tasks/handle-lane-id-update");
        } catch (error) {
          res
            .status(500)
            .json({ error: "Failed to handle task lane ID update" });
        }
      }
    );
  }
}
