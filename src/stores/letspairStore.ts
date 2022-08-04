import type { Task } from "@/models/Task";
import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "@/models/User";
import type { Lane } from "@/models/Lane";

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
    async addTaskToLane(task: Task, laneId: string) {
      updateLaneForElement(task.id, laneId, this.tasks);
    },
    async addDraftTaskToLane(
      draggedElementId: string,
      draggedOverElementId: string,
      addAbove: boolean
    ) {
      const draggedTask = this.tasks.find(
        (task) => task.id === draggedElementId
      );
      const draggedOverTask = this.tasks.find(
        (task) => task.id === draggedOverElementId
      );
      if (draggedTask && draggedOverTask) {
        const fromerDraftTaskIndex = this.tasks.findIndex(
          (task) => task.id === draggedTask.id && task.isDraft === true
        );
        if (fromerDraftTaskIndex != -1) {
          this.tasks.splice(fromerDraftTaskIndex, 1);
        }
        const indexOfDraggedOverTask = this.tasks.indexOf(draggedOverTask);
        const draftTask = JSON.parse(JSON.stringify(draggedTask));
        draftTask.isDraft = true;
        draftTask.laneId = draggedOverTask.laneId;
        const insertAtIndex = addAbove
          ? indexOfDraggedOverTask
          : indexOfDraggedOverTask + 1;
        this.tasks.splice(insertAtIndex, 0, draftTask);
      }
    },
    async freeUpTask(task: Task) {
      const indexOfUpdatedTask = this.tasks.findIndex(
        (existingTask) => existingTask.id === task.id
      );
      this.tasks[indexOfUpdatedTask].laneId = undefined;
    },
    async createUser() {
      const { data } = await axios.post("http://localhost:3000/user", {
        order: this.users.length + 1,
        name: "John Wayne",
      });
      const user = data as User;
      this.users.push(user);
    },
    async createLane() {
      const { data } = await axios.post("http://localhost:3000/lane");
      const lane = data as Lane;
      this.lanes.push(lane);
    },
    async addUserToLane(user: User, laneId: string) {
      updateLaneForElement(user.id, laneId, this.users);
    },
    async addDraftUserToLane(
      draggedUserId: string,
      draggedOverUserId: string,
      addAbove: boolean
    ) {
      const draggedUser = this.users.find((user) => user.id === draggedUserId);
      const draggedOverUser = this.users.find(
        (user) => user.id === draggedOverUserId
      );
      if (draggedUser && draggedOverUser) {
        const fromerDraftUserIndex = this.users.findIndex(
          (user) => user.id === draggedUser.id && user.isDraft === true
        );
        if (fromerDraftUserIndex != -1) {
          this.users.splice(fromerDraftUserIndex, 1);
        }
        const indexOfDraggedOverUser = this.users.indexOf(draggedOverUser);
        const draftUser = JSON.parse(JSON.stringify(draggedUser));
        draftUser.isDraft = true;
        draftUser.laneId = draggedOverUser.laneId;
        const indertAtIndex = addAbove
          ? indexOfDraggedOverUser
          : indexOfDraggedOverUser + 1;
        this.users.splice(indertAtIndex, 0, draftUser);
      }
    },
    async freeUpUser(user: User) {
      updateLaneForElement(user.id, undefined, this.users);
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
}

const updateLaneForElement = (
  elementId: string,
  laneId: string | undefined,
  elements: User[] | Task[]
) => {
  const indexOfUpdatedUser = elements.findIndex(
    (existingElement) =>
      existingElement.id === elementId && !existingElement.isDraft
  );
  const indexOfDraftElement = elements.findIndex(
    (existingElement) =>
      existingElement.id === elementId && existingElement.isDraft === true
  );
  if (indexOfDraftElement === -1) {
    elements[indexOfUpdatedUser].laneId = laneId;
  } else {
    elements[indexOfDraftElement].isDraft = false;
    elements.splice(indexOfUpdatedUser, 1);
  }
};
