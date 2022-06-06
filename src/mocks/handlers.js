import { rest } from "msw";
const task = {
  id: 1,
  description: "Very important task 1",
  oder: 1,
};
export const restHandlers = [
  rest.post("http://localhost:3000/task", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(task));
  }),
];
