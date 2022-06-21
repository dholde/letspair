import type { User } from "@/models/User";
import { rest, type PathParams, type RestContext } from "msw";
import { v4 as uuidv4 } from "uuid";

interface CreateUserRequestBody {
  id: string;
  order: number;
}

interface CreateUserResponse {
  id: string;
  order: number;
}

export const restHandlers = [
  rest.post("http://localhost:3000/task", (req, res, ctx) => {
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
    "http://localhost:3000/user",
    (req, res, ctx) => {
      const { order } = req.body;
      return res(
        ctx.status(201),
        ctx.json({
          id: `${uuidv4()}`,
          order: order,
        })
      );
    }
  ),
];
