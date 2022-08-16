<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingTask from "./PairingTask.vue";
import type { Task } from "@/models/Task";
import axios from "axios";
import { useDropEvent } from "@/composables/dragAndDrop";
const store = useStore();
const tasks = computed(() => {
  return store.unassignedTasks;
});
const taskAreaElement = ref<HTMLElement | null>(null);
function createTask() {
  store.createTask();
}

useDropEvent(taskAreaElement, "http://localhost:3000/task", "task");

// async function onDrop(event: DragEvent) {
//   event.preventDefault();
//   const dataTransfer = event.dataTransfer;
//   if (dataTransfer) {
//     const dataTransferType = dataTransfer.items[0].type;
//     if (dataTransferType === "task") {
//       const taskAsString: string = event.dataTransfer?.getData(
//         "task"
//       ) as string;
//       const taskFromDropEvent = JSON.parse(taskAsString) as Task;
//       taskFromDropEvent.laneId = undefined;
//       await axios.put("http://localhost:3000/task", taskFromDropEvent);
//       store.freeUpTask(taskFromDropEvent);
//     }
//   }
// }
</script>
<template>
  <!-- <div
    id="taskArea"
    @dragenter.prevent
    @dragover.prevent
    @drop="onDrop($event)"
  > -->
  <div id="taskArea" @dragenter.prevent @dragover.prevent ref="taskAreaElement">
    Tasks
    <button @click="createTask">+</button>
    <PairingTask v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>
