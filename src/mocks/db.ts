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
      const { updatedItem, oldIndexOfUpdatedTask } = { ...req.body } as {
        updatedItem: Task;
        oldIndexOfUpdatedTask: number;
      };
      updatedItem.laneId = updatedItem.laneId == null ? "" : updatedItem.laneId;
      // Query all tasks with laneId
      const tasks: Task[] = db.task.findMany({
        where: {
          laneId: {
            in: [updatedItem.laneId, ""],
          },
        },
      });
      // Update order
      tasks
        .map((task) => {
          if (task.id === updatedItem.id) {
            task = updatedItem;
          } else if (
            task.order <= updatedItem.order &&
            task.order > oldIndexOfUpdatedTask
          ) {
            task.order = task.order - 1; // updatedTask moved from below to above the task
          } else if (
            task.order >= updatedItem.order &&
            task.order < oldIndexOfUpdatedTask
          ) {
            task.order = task.order + 1; // updatedTask moved from above to below the task
          }
          return task;
        })
        //.splice(updatedTask.order, 0, updatedTask)
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
  // rest.post("http://localhost:5173/lanes", (req, res, ctx) => {
  //   return res(ctx.status(201), ctx.json({ status: "ok" }));
  // }),
];

export const handlers = [
  ...db.user.toHandlers("rest"),
  ...db.task.toHandlers("rest"),
  ...db.lane.toHandlers("rest"),
  ...customHandlers,
];
