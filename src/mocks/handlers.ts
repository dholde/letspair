import { rest, type PathParams } from "msw";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@/models/Task";

export const restHandlers = [
  rest.post("http://localhost:5173/tasks/update-order", (req, res, ctx) => {
    const task = JSON.parse(res.body) as Task;

    return res(
      ctx.status(201),
      ctx.json({
        id: `${uuidv4()}`,
        description: "",
        order: 0,
      })
    );
  }),
  rest.post<CreateUserRequestBody, PathParams<string>, CreateUserResponse>(
    "http://localhost:5173/user",
    (req, res, ctx) => {
      const { order } = req.body;
      return res(
        ctx.status(201),
        ctx.json({
          id: `${uuidv4()}`,
          order: order,
          name: "",
        })
      );
    }
  ),

  rest.post("http://localhost:5173/lane", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: `${uuidv4()}`,
      })
    );
  }),
];
