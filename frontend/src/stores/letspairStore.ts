import { Task } from "@/models/Task";
import { defineStore } from "pinia";
import axios from "axios";
import { User } from "@/models/User";
import type { Lane } from "@/models/Lane";
import type { Draggable } from "@/models/Draggable";
import { PairingBoard } from "@/models/PairingBoard";

export const useStore = defineStore({
  id: "letsPair",
  state: () => ({
    tasks: [] as Task[],
    users: [] as User[],
    lanes: [] as Lane[],
    pairingBoard: {} as PairingBoard,
    dragAndDropInfo: {
      draggedItemId: null,
      draggedOverItemId: null,
    } as DragAndDropInfo,
  }),
  actions: {
    async deleteItem(itemType: string, itemId: string, order: number) {
      try {
        const response = await axios.post("http://localhost:5173/delete-item", {
          itemType,
          itemId,
          order,
        });
        if (itemType === "task") {
          this.tasks = response.data as Task[];
        } else {
          this.users = response.data as User[];
        }
      } catch (err) {
        console.error(err);
      }
    },

    async createEntity(entityType: "task" | "user") {
      const entityListOfInterest =
        entityType === "task" ? this.tasks : this.users;

      const entity = instantiateEntity(entityListOfInterest, entityType);

      this.pairingBoard = addEntityToPairingBoard(
        this.pairingBoard,
        entity,
        entityType
      );

      try {
        const response = await axios.post(
          "http://localhost:5173/pairing-board",
          this.pairingBoard
        );
        this.pairingBoard = response.data as PairingBoard;
        this.tasks = this.pairingBoard.tasks;
        this.users = this.pairingBoard.users;
      } catch (err) {
        alert(`Error creating entity of type ${entityType}: ${err}`);
        console.error(err);
      }
    },
    async updateEntity(entity: Draggable, entityType: "task" | "user") {
      const entityListOfInterest =
        entityType === "task" ? this.tasks : this.users;
      const entityToUpdate = entityListOfInterest.find(
        (existingEntity) => existingEntity.id === entity.id
      );
      if (entityToUpdate) {
        Object.assign(entityToUpdate, entity);
        try {
          // const responseGet = await axios.get(
          //   `http://localhost:5173/pairing-board/${this.pairingBoard.id}`
          // );
          const response = await axios.put(
            `http://localhost:5173/pairing-boards/${this.pairingBoard.id}`,
            this.pairingBoard
          );
          this.pairingBoard = response.data as PairingBoard;
          this.tasks = this.pairingBoard.tasks;
          this.users = this.pairingBoard.users;
        } catch (err) {
          console.error(err);
        }
      } else {
        alert(
          `Entity of type ${entityType} not found in pairingBoard for id: ${entity.id}`
        );
        console.error(
          `Entity of type ${entityType} not found in pairingBoard for id: ${entity.id}`
        );
      }
    },

    async addDraftTaskToLane(
      draggedTaskId: string,
      draggedOverTaskId: string,
      addAbove: boolean
    ) {
      addDraftItemToLane(
        draggedTaskId,
        draggedOverTaskId,
        addAbove,
        this.tasks
      );
    },
    async updateUserName(userId: string, userName: string) {
      const userToUpdate = this.pairingBoard.users.find(
        (existingUser) => existingUser.id === userId
      );

      if (userToUpdate) {
        userToUpdate.name = userName;
        try {
          const response = await axios.put(
            "http://localhost:5173/pairing-board",
            this.pairingBoard
          );
          this.pairingBoard = response.data as PairingBoard;
          this.users = this.pairingBoard.users;
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error("User not found in pairingBoard");
      }
    },
    async createLane() {
      try {
        const { data } = await axios.post("http://localhost:5173/lanes");
        const lane = data as Lane;
        this.lanes.push(lane);
      } catch (err) {
        console.error(err);
      }
    },
    async addDraftUserToLane(
      draggedUserId: string,
      draggedOverUserId: string,
      addAbove: boolean
    ) {
      addDraftItemToLane(
        draggedUserId,
        draggedOverUserId,
        addAbove,
        this.users
      );
    },
    removeDraftItem(itemType: string) {
      console.log(`removeDraftItem ...`);
      if (itemType === "user") {
        console.log(`Print users: ${JSON.stringify(this.users)}`);
        this.users = this.users.filter((user) => !user.isDraft);
      } else if (itemType === "task") {
        console.log(`Print tasks before: ${JSON.stringify(this.tasks)}`);
        this.tasks = this.tasks.filter((task) => !task.isDraft);
        console.log(`Print tasks after: ${JSON.stringify(this.tasks)}`);
      }
    },
    // Check this logic to be correct
    async updateLaneForItem(
      itemId: string,
      itemType: string,
      laneId: string | undefined
    ) {
      const items = itemType === "task" ? this.tasks : this.users;
      const { currentIndexOfDraggedItem, indexOfDraftItem } = getIndexes(
        items,
        itemId
      );
      let itemToUpdate;
      if (draftItemExists(indexOfDraftItem)) {
        itemToUpdate = items[indexOfDraftItem];
        items.splice(currentIndexOfDraggedItem, 1);
      } else {
        itemToUpdate = items[currentIndexOfDraggedItem];
      }
      updateItemFields(itemToUpdate, laneId, itemId, items);
      updateItemOrders(items);

      const oldIndexOfUpdatedItem = getOriginalIndexOfItemToUpdate(
        indexOfDraftItem,
        currentIndexOfDraggedItem
      );

      const subPath = itemType === "task" ? "tasks" : "users";
      try {
        await axios.post(
          //TODO: Fix this so it's called also for tasks (Mock server has to be adapted)
          `http://localhost:5173/${subPath}/handle-lane-id-update`,
          {
            updatedItem: itemToUpdate,
            oldIndexOfUpdatedItem: oldIndexOfUpdatedItem,
          }
        );
        // TODO: Check for response code to be success, otherwise throw
        const responseWithListOfItems = (
          await axios.get(`http://localhost:5173/${subPath}`)
        ).data as Task[] | User[];
        responseWithListOfItems.sort((a, b) => a.order - b.order);
        if (itemType === "task") {
          this.tasks = responseWithListOfItems as Task[];
        } else {
          this.users = responseWithListOfItems as User[];
          console.log(this.users);
        }
      } catch (err) {
        console.error(err); //TODO: Display error
      }
    },
  },
  getters: {
    usersForLaneId: (state) => {
      return (laneId: string) =>
        state.users
          .filter((user) => user.laneId === laneId)
          .sort((user1, user2) => user1.order - user2.order);
    },
    unassignedUsers: (state) =>
      state.users
        .filter((user) => !user.laneId || user.laneId === "")
        .sort((user1, user2) => user1.order - user2.order),
    tasksForLaneId: (state) => {
      const tasks = (laneId: string) =>
        state.tasks
          .filter((task) => task.laneId === laneId)
          .sort((task1, task2) => task1.order - task2.order);
      return tasks;
    },
    unassignedTasks: (state) =>
      state.tasks
        .filter((task) => !task.laneId || task.laneId === "")
        .sort((task1, task2) => task1.order - task2.order),
  },
});

// This isn't located in the 'models' folder as it's a transient data structure
interface DragAndDropInfo {
  draggedItemId: string | null;
  draggedOverItemId: string | null;
  addAbove: boolean | null;
  addPositionChanged: false;
  currentLaneId: string | null;
}

const instantiateEntity = (
  entityList: Draggable[],
  entityType: string
): Draggable => {
  const unassignedEntityListLength = entityList.filter(
    (item) => item.laneId == null || item.laneId == ""
  ).length;

  const entity =
    entityType === "task"
      ? new Task(unassignedEntityListLength)
      : new User(unassignedEntityListLength);
  return entity;
};

const addEntityToPairingBoard = (
  pairingBoard: PairingBoard,
  entity: Draggable,
  entityType: "task" | "user"
) => {
  if (!pairingBoard || Object.keys(pairingBoard).length == 0) {
    pairingBoard = new PairingBoard();
  }
  if (entityType === "task") {
    pairingBoard.tasks.push(entity as Task);
  } else {
    pairingBoard.users.push(entity as User);
  }
  return pairingBoard;
};

const addDraftItemToLane = (
  draggedItemId: string,
  draggedOverItemId: string,
  addAbove: boolean,
  items: Draggable[]
) => {
  const draggedItem = items.find((item) => item.id === draggedItemId);
  const draggedOverItem = items.find((item) => item.id === draggedOverItemId);
  if (draggedItem && draggedOverItem) {
    const fromerDraftItemIndex = items.findIndex(
      (item) => item.id === draggedItem.id && item.isDraft === true
    );
    if (fromerDraftItemIndex != -1) {
      items.splice(fromerDraftItemIndex, 1);
    }
    const indexOfDraggedOverItem = items.indexOf(draggedOverItem);
    const draftItem = JSON.parse(JSON.stringify(draggedItem));
    draftItem.isDraft = true;
    draftItem.laneId = draggedOverItem.laneId;
    const insertAtIndex = addAbove
      ? indexOfDraggedOverItem
      : indexOfDraggedOverItem + 1;
    // draftItem.order = insertAtIndex;
    items.splice(insertAtIndex, 0, draftItem);
    items.forEach((item, index) => (item.order = index));
    console.log("sf");
    console.log(`Printing items: ${JSON.stringify(items)}`);
  }
};
const isDraftItemInsertedBeforeOriginalItem = (
  indexOfDraftItem: number,
  indexOfOriginalItem: number
) => indexOfDraftItem < indexOfOriginalItem;

const getIndexes = (
  items: Task[] | User[],
  itemId: string
): { currentIndexOfDraggedItem: number; indexOfDraftItem: number } => {
  const currentIndexOfDraggedItem = items.findIndex(
    (item) => item.id === itemId && !item.isDraft
  );
  const indexOfDraftItem = items.findIndex(
    (existingItem) =>
      existingItem.id === itemId && existingItem.isDraft === true
  );
  return { currentIndexOfDraggedItem, indexOfDraftItem };
};

const getOriginalIndexOfItemToUpdate = (
  indexOfDraftItem: number,
  currentIndexOfDraggedItem: number
): number => {
  return isDraftItemInsertedBeforeOriginalItem(
    indexOfDraftItem,
    currentIndexOfDraggedItem
  )
    ? currentIndexOfDraggedItem - 1
    : currentIndexOfDraggedItem;
};

const draftItemExists = (indexOfDraftItem: number): boolean => {
  return indexOfDraftItem !== -1;
};

const updateItemFields = (
  itemToUpdate: Draggable,
  laneId: string | undefined,
  itemId: string,
  items: Task[] | User[]
): void => {
  itemToUpdate.isDraft = false;
  itemToUpdate.laneId = laneId;
  itemToUpdate.order = items.findIndex((item) => item.id === itemId);
};

const updateItemOrders = (items: Task[] | User[]): void => {
  items.forEach((item, index) => (item.order = index));
};
