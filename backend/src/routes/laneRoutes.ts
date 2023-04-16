import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Service } from "../services/Service";
import { LaneModel } from "../model";

export class LaneRoutes {
  private laneService: Service<LaneModel>;
  private router: Router;
  constructor(laneService: Service<LaneModel>) {
    this.laneService = laneService;
    this.router = Router();
  }

  get(): Router {
    this.configureRoutes();
    return this.router;
  }

  configureRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const lanes = await this.laneService.getItems();
        res.json(lanes);
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve lanes" });
      }
    });

    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const lane = await this.laneService.getItemById(id);
        if (!lane) {
          res.status(404).json({ error: "Lane not found" });
          return;
        }
        res.json(lane);
      } catch (error) {
        res.status(500).json({ error: "Failed to retrieve lane" });
      }
    });

    this.router.post("/", async (req: Request, res: Response) => {
      try {
        const lane = req.body;
        const result = await this.laneService.saveItem(lane);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to save lane" });
      }
    });

    this.router.put("/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const updatedLane = req.body;
        const response: LaneModel = await this.laneService.updateItem(
          new ObjectId(id),
          updatedLane
        );
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: "Failed to update lane" });
      }
    });

    this.router.delete("/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const result = await this.laneService.deleteItem(new ObjectId(id));
        res.json({ result: result });
      } catch (error) {
        console.error(`Failed to delete lane with id ${id}`, error);
        res.status(500).send(`Failed to delete lane with id ${id}`);
      }
    });
  }
}
