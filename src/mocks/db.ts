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
    description: String,
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
      const updatedTask = JSON.parse(req.body) as Task;
      // Update laneId
      const tasks: Task[] = db.task.findMany({
        where: {
          laneId: {
            equals: updatedTask.laneId,
          },
        },
      });
      // Update order
      tasks
        .map((task) => {
          if (task.order >= updatedTask.order) {
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
    }
  ),
];

export const handlers = [
  ...db.user.toHandlers("rest"),
  ...db.task.toHandlers("rest"),
  ...db.lane.toHandlers("rest"),
  ...customHandlers,
];
