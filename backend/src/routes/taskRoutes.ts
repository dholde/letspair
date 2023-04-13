import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { DraggableItemService } from "../services/DraggableItemService";
import { TaskModel } from "../model";

const router = Router();
let taskService: DraggableItemService<TaskModel>;

router.get("/", async (req: Request, res: Response) => {
  try {
    const tasks = await taskService.getItems();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tasks" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
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

router.post("/", async (req: Request, res: Response) => {
  try {
    const task = req.body;
    const result = await taskService.saveItem(task);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to save task" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTask = req.body;
    await taskService.updateItem(new ObjectId(id), updatedTask);
    res.send(`Task ${id} has been updated`);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

router.post("/handle-lane-id-update", async (req: Request, res: Response) => {
  try {
    const { updatedItem, oldIndexOfUpdatedItem } = req.body;
    await taskService.handleDrag(updatedItem, oldIndexOfUpdatedItem);
    res.send("POST /tasks/handle-lane-id-update");
  } catch (error) {
    res.status(500).json({ error: "Failed to handle task lane ID update" });
  }
});

export default router;
