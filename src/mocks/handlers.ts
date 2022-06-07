import { rest } from "msw";
const task = {
  id: "1",
  description: "Very important task 1",
  order: 0,
};
export const restHandlers = [
  rest.post("http://localhost:3000/task", (req, res, ctx) => {
    console.log(`INTERCEPT POST: ${ctx.json(task)}`);
    return res(ctx.status(200), ctx.json(task));
  }),
];
