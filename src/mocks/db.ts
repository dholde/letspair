import { factory, primaryKey, nullable } from "@mswjs/data";
import { faker } from "@faker-js/faker";
import { rest } from "msw";
import type { Task } from "@/models/Task";

export const db = factory({
  user: {
    id: primaryKey(faker.datatype.uuid),
    order: Number,
    name: nullable(String),
    laneId: nullable(String),
  },
  task: {
    id: primaryKey(faker.datatype.uuid),
    description: nullable(String),
    order: Number,
    laneId: nullable(String),
    link: String,
    linkText: String,
    isCurrentlyDragged: Boolean,
    isDraft: Boolean,
  },
  lane: {
    id: primaryKey(faker.datatype.uuid),
  },
});

export const customHandlers = [
  rest.post(
    "http://localhost:5173/tasks/handle-lane-id-update",
    (req, res, ctx) => {
      const updatedTask = req.body as Task;
      updatedTask.laneId = updatedTask.laneId == null ? "" : updatedTask.laneId;
      // Query all tasks with laneId
      const tasks: Task[] = db.task.findMany({
        where: {
          laneId: {
            in: [updatedTask.laneId, ""],
          },
        },
      });
      // Update order
      tasks
        .map((task) => {
          if (task.order >= updatedTask.order && task.id !== updatedTask.id) {
            task.order = task.order + 1;
            return task;
          }
        })
        .splice(updatedTask.order, 0, updatedTask)
        .forEach((task) => {
          db.task.update({
            where: {
              id: {
                equals: task!.id,
              },
            },
            data: {
              ...task,
            },
          });
        });
      return res(ctx.status(201), ctx.json({ status: "ok" }));
    }
  ),
];

export const handlers = [
  ...db.user.toHandlers("rest"),
  ...db.task.toHandlers("rest"),
  ...db.lane.toHandlers("rest"),
  ...customHandlers,
];
