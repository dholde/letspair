import { factory, primaryKey, nullable, manyOf } from "@mswjs/data";
import { faker } from "@faker-js/faker";
import { rest } from "msw";
import type { Task } from "@/models/Task";
import type { User } from "@/models/User";
import type { Lane } from "@/models/Lane";
import type { PrimaryKey } from "@mswjs/data/lib/primaryKey";
import type { NullableProperty } from "@mswjs/data/lib/nullable";
import type { ModelAPI } from "@mswjs/data/lib/glossary";

// type apiModel = {
//   user: {
//     id: PrimaryKey<string>;
//     order: NumberConstructor;
//     name: NullableProperty<string>;
//     laneId: NullableProperty<string>;
//   };
//   task: {
//     id: PrimaryKey<string>;
//     description: NullableProperty<string>;
//     order: NumberConstructor;
//     laneId: NullableProperty<string>;
//     link: StringConstructor;
//     linkText: StringConstructor;
//     isCurrentlyDragged: BooleanConstructor;
//     isDraft: BooleanConstructor;
//   };
//   lane: {
//     id: PrimaryKey<string>;
//   };
// };

type TaskType = {
  id: PrimaryKey<string>;
  description: NullableProperty<string>;
  order: number;
  laneId: NullableProperty<string>;
  link: NullableProperty<string>;
  linkText: NullableProperty<string>;
  isCurrentlyDragged: NullableProperty<boolean>;
  isDraft: NullableProperty<boolean>;
};

type apiModel = {
  user: {
    id: PrimaryKey<string>;
    order: NumberConstructor;
    name: NullableProperty<string>;
    laneId: NullableProperty<string>;
  };
  task: {
    id: PrimaryKey<string>;
    description: NullableProperty<string>;
    order: NumberConstructor;
    laneId: NullableProperty<string>;
    link: StringConstructor;
    linkText: StringConstructor;
    isCurrentlyDragged: BooleanConstructor;
    isDraft: BooleanConstructor;
  };
  lane: {
    id: PrimaryKey<string>;
  };
  pairingBoard: {
    id: PrimaryKey<string>;
    tasks: [TaskType];
  };
};

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
    link: nullable(String),
    linkText: nullable(String),
    isCurrentlyDragged: nullable(Boolean),
    isDraft: nullable(Boolean),
  },
  lane: {
    id: primaryKey(faker.datatype.uuid),
  },
  pairingBoard: {
    id: primaryKey(faker.datatype.uuid),
    tasks: manyOf("task"),
    users: manyOf("user"),
    lanes: manyOf("lane"),
  },
});

export const customHandlers = [
  rest.get("http://localhost:5173/pairing-boards", (req, res, ctx) => {
    const pairingBoards = db.pairingBoard.getAll();
    return res(ctx.json(pairingBoards));
  }),
  rest.put("http://localhost:5173/pairing-boards/:id", (req, res, ctx) => {
    const { id, tasks, users, lanes } = { ...req.body } as {
      id: string;
      tasks: Task[];
      users: User[];
      lanes: Lane[];
    };
    if (tasks) {
      tasks.map((task) => {
        return db.task.update({
          where: {
            id: {
              equals: task.id,
            },
          },
          data: task,
        });
      });
    }

    if (users) {
      users.map((user) => {
        return db.user.update({
          where: {
            id: {
              equals: user.id,
            },
          },
          data: user,
        });
      });
    }

    if (lanes) {
      lanes.map((lane) => {
        return db.lane.update({
          where: { id: { equals: lane.id } },
          data: lane,
        });
      });
    }
    updatePairingBoard(id);
    return res(ctx.json(db.pairingBoard.getAll()[0]));
  }),
  rest.post("http://localhost:5173/pairing-boards", (req, res, ctx) => {
    const { id, tasks, users, lanes } = { ...req.body } as {
      id: string;
      tasks: Task[];
      users: User[];
      lanes: Lane[];
    };

    if (tasks) {
      tasks.map((task) => {
        if (!task.id) {
          return db.task.create(task);
        }
      });
    }

    if (users) {
      users.map((user) => {
        if (!user.id) {
          return db.user.create(user);
        }
      });
    }

    if (lanes) {
      lanes.map((lane) => {
        if (!lane.id) {
          return db.lane.create(lane);
        }
      });
    }

    updatePairingBoard(id);

    return res(ctx.json(db.pairingBoard.getAll()[0]));
  }),
  // rest.post("http://localhost:5173/delete-item", (req, res, ctx) => {
  //   const { itemType, itemId, order } = { ...req.body } as {
  //     itemType: "user" | "task";
  //     itemId: string;
  //     order: number;
  //   };
  //   const dbModel: ModelAPI<apiModel, typeof itemType> =
  //     itemType === "task" ? db.task : db.user;
  //   dbModel.delete({
  //     where: {
  //       id: {
  //         equals: itemId,
  //       },
  //     },
  //   });
  //   const itemsWithGreaterOrder = dbModel.findMany({
  //     where: {
  //       order: {
  //         gt: order,
  //       },
  //     },
  //   });
  //   dbModel.updateMany({
  //     where: {
  //       id: {
  //         in: itemsWithGreaterOrder.map((item) => item.id),
  //       },
  //     },
  //     data: {
  //       order: (order) => order - 1,
  //     },
  //   });
  //   const items = dbModel.findMany({});
  //   return res(ctx.status(200), ctx.json(items));
  // }),
  // rest.post(
  //   "http://localhost:5173/tasks/handle-lane-id-update",
  //   (req, res, ctx) => {
  //     const { updatedItem, oldIndexOfUpdatedItem } = { ...req.body } as {
  //       updatedItem: Task;
  //       oldIndexOfUpdatedItem: number;
  //     };
  //     handleDraggableItemLaneIdUpdate(
  //       "task",
  //       updatedItem,
  //       oldIndexOfUpdatedItem
  //     );
  //     return res(ctx.status(201), ctx.json({ status: "ok" }));
  //   }
  // ),
  // rest.post(
  //   "http://localhost:5173/users/handle-lane-id-update",
  //   (req, res, ctx) => {
  //     const { updatedItem, oldIndexOfUpdatedItem } = {
  //       ...req.body,
  //     } as {
  //       updatedItem: User;
  //       oldIndexOfUpdatedItem: number;
  //     };
  //     handleDraggableItemLaneIdUpdate(
  //       "user",
  //       updatedItem,
  //       oldIndexOfUpdatedItem
  //     );
  //     return res(ctx.status(201), ctx.json({ status: "ok" }));
  //   }
  // ),
];

const updatePairingBoard = (id: string) => {
  const allTasks = db.task.getAll();
  const allUsers = db.user.getAll();
  const allLanes = db.lane.getAll();
  const pairingBoards = db.pairingBoard.getAll();
  let pairingBoard = pairingBoards[0];
  if (!pairingBoards.length) {
    pairingBoard = db.pairingBoard.create({
      id,
      tasks: allTasks,
      users: allUsers,
      lanes: allLanes,
    });
  } else {
    db.pairingBoard.update({
      where: {
        id: {
          equals: pairingBoard.id,
        },
      },
      data: {
        tasks: allTasks,
        users: allUsers,
        lanes: allLanes,
      },
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
    itemsWithUpdatedOrders.forEach((user) => {
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

export const handlers = [
  ...db.user.toHandlers("rest", "http://localhost:5173"),
  ...db.task.toHandlers("rest", "http://localhost:5173"),
  ...db.lane.toHandlers("rest", "http://localhost:5173"),
  ...db.pairingBoard.toHandlers("rest", "http://localhost:5173"),
  ...customHandlers,
];
