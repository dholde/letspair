import { Task } from "@/models/Task";
import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "@/models/User";

export const useStore = defineStore({
  id: "letsPair",
  state: () => ({
    tasks: [] as Task[],
    users: [] as User[],
  }),
  actions: {
    async createTask() {
      const { data } = await axios.post("http://localhost:3000/task");
      const task = data as Task;
      this.tasks.push(task);
    },
    async createUser() {
      const { data } = await axios.post("http://localhost:3000/user", {
        order: this.users.length + 1,
      });
      const user = data as User;
      this.users.push(user);
    },
  },
});
