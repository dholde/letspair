<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingTask from "./PairingTask.vue";
import { useDropEvent } from "@/composables/dragAndDrop";
const store = useStore();
const tasks = computed(() => {
  return store.unassignedTasks;
});
const taskAreaElement = ref<HTMLElement | null>(null);
function createTask() {
  store.createTask();
}

useDropEvent(taskAreaElement, "http://localhost:3000/task");
</script>
<template>
  <div id="taskArea" @dragenter.prevent @dragover.prevent ref="taskAreaElement">
    Tasks
    <button @click="createTask">+</button>
    <PairingTask v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>
