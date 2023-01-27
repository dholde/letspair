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
      const originalTask: Task = db.task.findFirst({
        where: {
          id: {
            equals: updatedItem.id,
          },
        },
      });
      const tasks: Task[] = db.task.findMany({
        where: {
          laneId: {
            in: [updatedItem.laneId],
          },
        },
      });
      if (originalTask.laneId === updatedItem.laneId) {
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
      } else {
        //Update new lane orders
        tasks.map((task) => {
          if (task.order >= updatedItem.order) {
            task.order = task.order + 1;
          }
          return task;
        });
        //Update old lane orders
        const tasksFormerLane: Task[] = db.task.findMany({
          where: {
            laneId: {
              equals: originalTask.laneId,
            },
          },
        });
        tasksFormerLane.forEach((task) => {
          if (task.id === updatedItem.id) {
            task.laneId = updatedItem.laneId;
            task.order = updatedItem.order;
          } else if (task.order >= oldIndexOfUpdatedTask) {
            task.order = task.order - 1;
          }
        });
        const allTasks = [...tasks, ...tasksFormerLane];
        allTasks.forEach((task) => {
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
      return res(ctx.status(201), ctx.json({ status: "ok" }));
    }
  ),
];

export const handlers = [
  ...db.user.toHandlers("rest", "http://localhost:5173"),
  ...db.task.toHandlers("rest", "http://localhost:5173"),
  ...db.lane.toHandlers("rest", "http://localhost:5173"),
  ...customHandlers,
];
