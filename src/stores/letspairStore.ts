import type { Task } from "@/models/Task";
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
      const { data } = await axios.post("http://localhost:3000/task");
      const task = data as Task;
      this.tasks.push(task);
    },
    async updateTask(task: Task) {
      await axios.put("http://localhost:3000/task", JSON.stringify(task));
      let taskToUpdate = this.tasks.find(
        (existingTask) => (existingTask.id = task.id)
      );
      console.log("Bla");
      taskToUpdate = task;
      taskToUpdate = { id: "134134", description: "TEEEEEEEST", order: 10 };
      console.log("Test ");
      // if (taskToUpdate) {
      //   taskToUpdate.description = task.description;
      // }
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
      const { data } = await axios.post("http://localhost:3000/user", {
        order: this.users.length + 1,
        name: "John Wayne",
      });
      const user = data as User;
      this.users.push(user);
    },
    async updateUserName(userId: string, userName: string) {
      const user = this.users.find((user) => user.id === userId);
      if (user) {
        user.name = userName;
        await axios.put("http://localhost:3000/user", JSON.stringify(user));
      }
    },
    async createLane() {
      const { data } = await axios.post("http://localhost:3000/lane");
      const lane = data as Lane;
      this.lanes.push(lane);
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
    updateLaneForItem(
      itemId: string,
      itemType: string,
      laneId: string | undefined
    ) {
      const items = itemType === "task" ? this.tasks : this.users;
      const indexOfUpdatedItem = items.findIndex(
        (existingItem) => existingItem.id === itemId && !existingItem.isDraft
      );
      const indexOfDraftItem = items.findIndex(
        (existingItem) =>
          existingItem.id === itemId && existingItem.isDraft === true
      );
      if (indexOfDraftItem === -1) {
        items[indexOfUpdatedItem].laneId = laneId;
      } else {
        items[indexOfDraftItem].isDraft = false;
        items[indexOfDraftItem].laneId = laneId;
        items.splice(indexOfUpdatedItem, 1);
      }
    },
  },
  getters: {
    usersForLaneId: (state) => {
      return (laneId: string) =>
        state.users.filter((user) => user.laneId === laneId);
    },
    unassignedUsers: (state) =>
      state.users.filter((user) => !user.laneId || user.laneId === ""),
    tasksForLaneId: (state) => {
      return (laneId: string) =>
        state.tasks.filter((task) => task.laneId === laneId);
    },
    unassignedTasks: (state) =>
      state.tasks.filter((task) => !task.laneId || task.laneId === ""),
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
    const indertAtIndex = addAbove
      ? indexOfDraggedOverItem
      : indexOfDraggedOverItem + 1;
    items.splice(indertAtIndex, 0, draftItem);
  }
};
