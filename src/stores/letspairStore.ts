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
      const indexOfUpdatedUser = this.users.findIndex(
        (existingUser) => existingUser.id === user.id
      );
      this.users[indexOfUpdatedUser].laneId = laneId;
    },
    async freeUpUser(user: User) {
      const indexOfUpdatedUser = this.users.findIndex(
        (existingUser) => existingUser.id === user.id
      );
      this.users[indexOfUpdatedUser].laneId = undefined;
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
