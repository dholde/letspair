import type { Task } from "@/models/Task";
import { defineStore } from "pinia";

export const useStore = defineStore({
  id: "letsPair",
  state: () => ({
    tasks: [] as Task[],
  }),
  actions: {
    createTask() {
      alert("Create task");
    },
  },
});
