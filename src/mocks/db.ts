import { factory, primaryKey, nullable } from "@mswjs/data";
import { faker } from "@faker-js/faker";
import { rest } from "msw";
import type { Task } from "@/models/Task";
import type { User } from "@/models/User";

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
  rest.post(
    "http://localhost:5173/users/handle-lane-id-update",
    (req, res, ctx) => {
      const { updatedItem, oldIndexOfUpdatedItem } = {
        ...req.body,
      } as {
        updatedItem: User;
        oldIndexOfUpdatedItem: number;
      };
      handleDraggableItemLaneIdUpdate(
        "user",
        updatedItem,
        oldIndexOfUpdatedItem
      );
      return res(ctx.status(201), ctx.json({ status: "ok" }));
    }
  ),
];

const findOriginalItem = (
  itemType: "task" | "user",
  itemId: string
): Task | User => {
  const whereClause = {
    where: {
      id: {
        equals: itemId,
      },
    },
  };
  if (itemType === "task") {
    return db.task.findFirst(whereClause) as Task;
  } else {
    return db.user.findFirst(whereClause) as User;
  }
};

const findItemsForLaneId = (
  itemType: "task" | "user",
  updateItemLaneId: string
): Task[] | User[] => {
  const whereClause = {
    where: {
      laneId: {
        in: [updateItemLaneId],
      },
    },
  };
  if (itemType === "task") {
    return db.task.findMany(whereClause) as Task[];
  } else {
    return db.user.findMany(whereClause) as User[];
  }
};

const handleNoLaneChange = (
  itemType: "task" | "user",
  items: Task[] | User[],
  updatedItem: Task | User,
  oldIndexOfUpdatedItem: number
) => {
  const itemsWithUpdatedOrders: Task[] | User[] = items.map((item) => {
    if (item.id === updatedItem.id) {
      item = updatedItem;
    } else if (
      item.order <= updatedItem.order &&
      item.order > oldIndexOfUpdatedItem
    ) {
      item.order = item.order - 1; // updatedTask moved from below to above the task
    } else if (
      item.order >= updatedItem.order &&
      item.order < oldIndexOfUpdatedItem
    ) {
      item.order = item.order + 1; // updatedTask moved from above to below the task
    }
    return item;
  });
  if (itemType === "task") {
    itemsWithUpdatedOrders.forEach((task) => {
      db.task.update({
        where: {
          id: {
            equals: task?.id,
          },
        },
        data: {
          ...task,
        },
      });
    });
  } else {
    items.forEach((user) => {
      db.user.update({
        where: {
          id: {
            equals: user?.id,
          },
        },
        data: {
          ...user,
        },
      });
    });
  }
};

const handleLaneChange = (
  itemsCurrentLane: Task[] | User[],
  itemType: "task" | "user",
  updatedItem: Task | User,
  originalItem: Task | User,
  oldIndexOfUpdatedItem: number
) => {
  //Update new lane orders
  itemsCurrentLane.map((item) => {
    if (item.order >= updatedItem.order) {
      item.order = item.order + 1;
    }
    return item;
  });
  //Update old lane orders
  if (itemType === "task") {
    const itemsFormerLane = db.task.findMany({
      where: {
        laneId: {
          equals: originalItem.laneId,
        },
      },
    });
    itemsFormerLane.forEach((item) => {
      if (item.id === updatedItem.id) {
        item.laneId = updatedItem.laneId;
        item.order = updatedItem.order;
      } else if (item.order >= oldIndexOfUpdatedItem) {
        item.order = item.order - 1;
      }
    });
    const allItems = [...itemsCurrentLane, ...itemsFormerLane];
    allItems.forEach((item) => {
      db.task.update({
        where: {
          id: {
            equals: item!.id,
          },
        },
        data: {
          ...item,
        },
      });
    });
  } else {
    const itemsFormerLane = db.user.findMany({
      where: {
        laneId: {
          equals: originalItem.laneId,
        },
      },
    });
    itemsFormerLane.forEach((item) => {
      if (item.id === updatedItem.id) {
        item.laneId = updatedItem.laneId;
        item.order = updatedItem.order;
      } else if (item.order >= oldIndexOfUpdatedItem) {
        item.order = item.order - 1;
      }
    });
    const allItems = [...itemsCurrentLane, ...itemsFormerLane];
    allItems.forEach((item) => {
      db.user.update({
        where: {
          id: {
            equals: item!.id,
          },
        },
        data: {
          ...item,
        },
      });
    });
  }
};

const handleDraggableItemLaneIdUpdate = (
  updatedItemType: "task" | "user",
  updatedItem: Task | User,
  oldIndexOfUpdatedTask: number
) => {
  updatedItem.laneId = updatedItem.laneId == null ? "" : updatedItem.laneId;
  // Query all tasks with laneId
  const originalItem: Task | User = findOriginalItem(
    updatedItemType,
    updatedItem.id
  );
  const itemsCurrentLane: Task[] | User[] = findItemsForLaneId(
    updatedItemType,
    updatedItem.laneId
  );

  if (originalItem.laneId === updatedItem.laneId) {
    handleNoLaneChange(
      updatedItemType,
      itemsCurrentLane,
      updatedItem,
      originalItem,
      oldIndexOfUpdatedTask
    );
  } else {
    //Update new lane orders
    handleLaneChange(
      itemsCurrentLane,
      updatedItemType,
      updatedItem,
      originalItem,
      oldIndexOfUpdatedTask
    );
  }
};

export const handlers = [
  ...db.user.toHandlers("rest", "http://localhost:5173"),
  ...db.task.toHandlers("rest", "http://localhost:5173"),
  ...db.lane.toHandlers("rest", "http://localhost:5173"),
  ...customHandlers,
];
