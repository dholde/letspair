import { Router, Request, Response } from "express";
import { DraggableItemService } from "../services/DraggableItemService";
import { ObjectId } from "mongodb";
import { UserModel } from "../model";

export class UserRoutes {
  private userService: DraggableItemService<UserModel>;
  private router: Router;
  constructor(userService: DraggableItemService<UserModel>) {
    this.userService = userService;
    this.router = Router();
  }

  get(): Router {
    this.configureRoutes();
    return this.router;
  }

  configureRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const users = await this.userService.getItems();
        res.json(users);
      } catch (error) {
        console.error("Failed to get users", error);
        res.status(500).send("Failed to get users");
      }
    });

    this.router.get("/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const user = await this.userService.getItemById(id);
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

    this.router.post("/", async (req: Request, res: Response) => {
      const user = req.body;
      try {
        const result = await this.userService.saveItem(user);
        res.json(result);
      } catch (error) {
        console.error("Failed to save user", error);
        res.status(500).send("Failed to save user");
      }
    });

    this.router.put("/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const updatedUser = req.body;
      try {
        const reponse: UserModel = await this.userService.updateItem(
          new ObjectId(id),
          updatedUser
        );
        res.json(reponse);
      } catch (error) {
        console.error(`Failed to update user ${id}`, error);
        res.status(500).send(`Failed to update user ${id}`);
      }
    });

    this.router.post(
      "/handle-lane-id-update",
      async (req: Request, res: Response) => {
        const { updatedItem, oldIndexOfUpdatedItem } = req.body;
        try {
          await this.userService.handleDrag(updatedItem, oldIndexOfUpdatedItem);
          res.send("POST /users/handle-lane-id-update");
        } catch (error) {
          console.error("Failed to handle lane id update", error);
          res.status(500).send("Failed to handle lane id update");
        }
      }
    );
  }
}
