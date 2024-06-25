import { rest } from "msw";
import type { PairingBoard } from "@/models/PairingBoard";
import { v4 } from "uuid";

export const handlers = [
  rest.post("http://localhost:5173/pairing-boards", async (req, res, ctx) => {
    const pairingBoard: PairingBoard = req.body as PairingBoard;

    pairingBoard.id = v4();
    if (isBrowser) {
      localStorage.setItem("pairingBoard", JSON.stringify(pairingBoard));
    } else {
      const fs = await import("fs");
      const path = await import("path");
      const mockDataDir = path.join(__dirname, "./");
      const jsonFilePath = path.join(mockDataDir, `mockdata.json`);
      const jsonData = JSON.stringify(pairingBoard);

      fs.writeFileSync(jsonFilePath, jsonData);
    }

    return res(ctx.status(201), ctx.json(pairingBoard));
  }),

  rest.get("http://localhost:5173/pairing-boards", async (req, res, ctx) => {
    let pairingBoard;
    if (isBrowser) {
      pairingBoard = localStorage.getItem("pairingBoard");
    } else {
      const fs = await import("fs");
      const path = await import("path");
      const mockDataDir = path.join(__dirname, "./");
      const jsonFilePath = path.join(mockDataDir, `mockdata.json`);
      if (fs.existsSync(jsonFilePath)) {
        const jsonData = fs.readFileSync(jsonFilePath, "utf-8");
        const pairingBoardFromFile: PairingBoard = JSON.parse(jsonData);
        pairingBoard = pairingBoardFromFile;
      }
    }
    if (pairingBoard) {
      return res(ctx.status(200), ctx.json([pairingBoard]));
    }
    return res(ctx.status(200), ctx.json([]));
  }),
];

const isBrowser = typeof window !== "undefined";
