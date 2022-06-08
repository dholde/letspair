import { Task } from "@/models/Task";
import { defineStore } from "pinia";
import axios from "axios";

export const useStore = defineStore({
  id: "letsPair",
  state: () => ({
    tasks: [] as Task[],
  }),
  actions: {
    async createTask() {
      const { data } = await axios.post("http://localhost:3000/task");
      const task = data as Task;
      this.tasks.push(task);
    },
  },
});
