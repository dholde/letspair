import { Task } from "@/models/Task";
import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "@/models/User";
import type { Lane } from "@/models/Lane";
import type { Draggable } from "@/models/Draggable";

export const useStore = defineStore({
  id: "letsPair",
  state: () => ({
    tasks: [] as Task[],
    users: [] as User[],
    lanes: [] as Lane[],
    dragAndDropInfo: {
      draggedItemId: null,
      draggedOverItemId: null,
    } as DragAndDropInfo,
  }),
  actions: {
    async createTask() {
      const unassignedTaskListLength = this.tasks.filter(
        (task) => task.laneId == null || task.laneId == ""
      ).length;
      const newTask = new Task(unassignedTaskListLength);
      try {
        const response = await axios.post(
          "http://localhost:5173/tasks",
          newTask
        );
        this.tasks.push(response.data);
      } catch (err) {
        console.error(err);
      }
    },
    async updateTask(task: Task) {
      try {
        await axios.put(`http://localhost:5173/tasks/${task.id}`, task);
      } catch (err) {
        console.error(err);
      }
      const taskToUpdate = this.tasks.find(
        (existingTask) => existingTask.id === task.id
      );
      Object.assign(taskToUpdate, task);
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
    async createUser() {
      try {
        const { data } = await axios.post("http://localhost:5173/users", {
          order: this.users.length + 1,
          name: "John Wayne",
        });
        const user = data as User;
        this.users.push(user);
      } catch (err) {
        console.error(err);
      }
    },
    async updateUserName(userId: string, userName: string) {
      const user = this.users.find((user) => user.id === userId);
      if (user) {
        user.name = userName;
        try {
          await axios.put("http://localhost:5173/users", JSON.stringify(user));
        } catch (err) {
          console.error(err);
        }
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
      if (itemType === "user") {
        this.users = this.users.filter((user) => !user.isDraft);
      } else if (itemType === "task") {
        this.tasks = this.tasks.filter((task) => !task.isDraft);
      }
    },
    async updateLaneForItem(
      itemId: string,
      itemType: string,
      laneId: string | undefined
    ) {
      const items = itemType === "task" ? this.tasks : this.users;
      const indexOfUpdatedItem = items.findIndex(
        (item) => item.id === itemId && !item.isDraft
      );
      const indexOfDraftItem = items.findIndex(
        (existingItem) =>
          existingItem.id === itemId && existingItem.isDraft === true
      );
      let itemToUpdate = items[indexOfDraftItem];
      if (indexOfDraftItem === -1) {
        itemToUpdate = items[indexOfUpdatedItem];
        itemToUpdate.laneId = laneId;
      } else {
        itemToUpdate.isDraft = false;
        itemToUpdate.laneId = laneId;
        items.splice(indexOfUpdatedItem, 1);
      }
      itemToUpdate.order = items.findIndex((item) => item.id === itemId);
      const oldIndexOfUpdatedItem = isDraftItemInsertedBeforeOriginalItem(
        indexOfDraftItem,
        indexOfUpdatedItem
      )
        ? indexOfUpdatedItem - 1
        : indexOfUpdatedItem;

      const subPath = itemType === "task" ? "tasks" : "users";
      try {
        await axios.post(
          `http://localhost:5173/${subPath}/handle-lane-id-update`,
          {
            updatedItem: itemToUpdate,
            oldIndexOfUpdatedTask: oldIndexOfUpdatedItem,
          }
        );
        // TODO: Check for response code to be success, otherwise throw
        const responseWithListOfItems = await axios.get(
          `http://localhost:5173/${subPath}`
        );
        this.tasks = responseWithListOfItems.data as Task[];
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
          .sort((user1, user2) => (user1.order < user2.order ? 1 : -1));
    },
    unassignedUsers: (state) =>
      state.users
        .filter((user) => !user.laneId || user.laneId === "")
        .sort((user1, user2) => (user1.order < user2.order ? 1 : -1)),
    tasksForLaneId: (state) => {
      return (laneId: string) =>
        state.tasks
          .filter((task) => task.laneId === laneId)
          .sort((task1, task2) => (task1.order < task2.order ? 1 : -1));
    },
    unassignedTasks: (state) => {
      const t = state.tasks
        .filter((task) => !task.laneId || task.laneId === "")
        .sort((task1, task2) => task1.order - task2.order);
      console.log(t);
      state.tasks = t;
      return state.tasks;
    },
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
  }
};
const isDraftItemInsertedBeforeOriginalItem = (
  indexOfDraftItem: number,
  indexOfOriginalItem: number
) => indexOfDraftItem < indexOfOriginalItem;
