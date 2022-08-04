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
      const indexOfUpdatedTask = this.tasks.findIndex(
        (existingTask) => existingTask.id === task.id
      );
      this.tasks[indexOfUpdatedTask].laneId = laneId;
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
      updateLaneForUser(user.id, laneId, this.users);
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
      updateLaneForUser(user.id, undefined, this.users);
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

const updateLaneForUser = (
  userId: string,
  laneId: string | undefined,
  users: User[]
) => {
  const indexOfUpdatedUser = users.findIndex(
    (existingUser) => existingUser.id === userId && !existingUser.isDraft
  );
  const indexOfDraftUser = users.findIndex(
    (existingUser) =>
      existingUser.id === userId && existingUser.isDraft === true
  );
  if (indexOfDraftUser === -1) {
    users[indexOfUpdatedUser].laneId = laneId;
  } else {
    users[indexOfDraftUser].isDraft = false;
    users.splice(indexOfUpdatedUser, 1);
  }
};
