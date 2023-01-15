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
        (task) => task.laneId == null
      ).length;
      const newTask = new Task(unassignedTaskListLength);
      const response = await axios.post("http://localhost:5173/tasks", newTask);
      this.tasks.push(response.data);
    },
    async updateTask(task: Task) {
      // Have to access properties via data field as props are proxies in vue3
      await axios.put(
        `http://localhost:5173/tasks/${task.id}`,
        JSON.stringify(task)
      );
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
      const { data } = await axios.post("http://localhost:5173/users", {
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
        await axios.put("http://localhost:5173/users", JSON.stringify(user));
      }
    },
    async createLane() {
      const { data } = await axios.post("http://localhost:5173/lanes");
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
      updateOrder(items, itemType);
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
    unassignedTasks: (state) =>
      state.tasks
        .filter((task) => !task.laneId || task.laneId === "")
        .sort((task1, task2) => (task1.order < task2.order ? 1 : -1)),
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
    items.splice(insertAtIndex, 0, draftItem);
  }
};

const updateOrder = (items: Task[] | User[], itemType: string) => {
  items.forEach((item, index) => (item.order = index));
  if (itemType === "task") {
    //Update list of tasks in backend
  } else {
    //Update list of users in backend
  }
};
