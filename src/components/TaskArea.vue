<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingTask from "./PairingTask.vue";
import type { Task } from "@/models/Task";
import axios from "axios";
const store = useStore();
const tasks = computed(() => {
  return store.unassignedTasks;
});
function createTask() {
  store.createTask();
}

async function onDrop(event: DragEvent) {
  event.preventDefault();
  const dataTransfer = event.dataTransfer;
  if (dataTransfer) {
    const dataTransferType = dataTransfer.items[0].type;
    if (dataTransferType === "task") {
      const taskAsString: string = event.dataTransfer?.getData(
        "task"
      ) as string;
      const taskFromDropEvent = JSON.parse(taskAsString) as Task;
      taskFromDropEvent.laneId = undefined;
      await axios.put("http://localhost:3000/task", taskFromDropEvent);
      store.freeUpTask(taskFromDropEvent);
    }
  }
}
</script>
<template>
  <div
    id="taskArea"
    @dragenter.prevent
    @dragover.prevent
    @drop="onDrop($event)"
  >
    Tasks
    <button @click="createTask">+</button>
    <PairingTask v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>
