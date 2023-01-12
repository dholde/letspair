import { rest, type PathParams } from "msw";
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
  rest.post("http://localhost:5173/task", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: `${uuidv4()}`,
        description: "",
        order: 0,
      })
    );
  }),
  rest.put("http://localhost:5173/task", (req, res, ctx) => {
    return res(ctx.status(204));
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
  rest.put("http://localhost:5173/user", (req, res, ctx) => {
    return res(ctx.status(204));
  }),
];
