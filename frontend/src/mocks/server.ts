import { setupServer } from "msw/node";
import fs from "fs";
import path from "path";
import { v4 } from "uuid";
import { rest } from "msw";
import type { PairingBoard } from "@/models/PairingBoard";

const handlers = [
  rest.post("http://localhost:5173/pairing-boards", (req, res, ctx) => {
    const pairingBoard: PairingBoard = req.body as PairingBoard;

    pairingBoard.id = v4();
    const mockDataDir = path.join(__dirname, "./");
    const jsonFilePath = path.join(mockDataDir, `mockdata.json`);
    const jsonData = JSON.stringify(pairingBoard);

    fs.writeFileSync(jsonFilePath, jsonData);

    return res(ctx.status(201), ctx.json(pairingBoard));
  }),

  rest.get("http://localhost:5173/pairing-boards", (req, res, ctx) => {
    const mockDataDir = path.join(__dirname, "./");
    const jsonFilePath = path.join(mockDataDir, `mockdata.json`);
    let pairingBoard;
    if (fs.existsSync(jsonFilePath)) {
      const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
      const pairingBoardFromFile: PairingBoard = JSON.parse(jsonData);
      pairingBoard = pairingBoardFromFile;
    }
    if (pairingBoard) {
      return res(ctx.status(200), ctx.json([pairingBoard]));
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
    const mockDataDir = path.join(__dirname, "./");
    const jsonFilePath = path.join(mockDataDir, `mockdata.json`);
    const jsonData = JSON.stringify(pairingBoard);

    fs.writeFileSync(jsonFilePath, jsonData);

    return res(ctx.status(200), ctx.json(pairingBoard));
  }),
];

// Intercepts requests in node environment (used for tests)
export const server = setupServer(...handlers);
