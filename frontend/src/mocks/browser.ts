import { setupWorker } from "msw";
import { rest } from "msw";
import type { PairingBoard } from "@/models/PairingBoard";
import { v4 } from "uuid";

const handlers = [
  rest.post("http://localhost:5173/pairing-boards", (req, res, ctx) => {
    const pairingBoard: PairingBoard = req.body as PairingBoard;

    pairingBoard.id = v4();
    localStorage.setItem("pairingBoard", JSON.stringify(pairingBoard));

    return res(ctx.status(201), ctx.json(pairingBoard));
  }),

  rest.get("http://localhost:5173/pairing-boards", (req, res, ctx) => {
    const pairingBoard = localStorage.getItem("pairingBoard");
    if (pairingBoard) {
      const response = JSON.parse(pairingBoard);
      if (pairingBoard) {
        return res(ctx.status(200), ctx.json([response]));
      }
    }
    return res(ctx.status(200), ctx.json([]));
  }),

  rest.put("http://localhost:5173/pairing-boards/:id", (req, res, ctx) => {
    const pairingBoard: PairingBoard = req.body as PairingBoard;
    pairingBoard.users.forEach((user) => {
      if (!user.id) {
        user.id = v4();
      }
    });
    pairingBoard.tasks.forEach((task) => {
      if (!task.id) {
        task.id = v4();
      }
    });

    pairingBoard.lanes.forEach((lane) => {
      if (!lane.id) {
        lane.id = v4();
      }
    });

    localStorage.setItem("pairingBoard", JSON.stringify(pairingBoard));

    return res(ctx.status(200), ctx.json(pairingBoard));
  }),
];

//Sets up service worker for client requests (browser)
export const worker = setupWorker(...handlers);
