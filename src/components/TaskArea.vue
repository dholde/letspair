<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import PairingTask from "./PairingTask.vue";
const store = useStore();
const tasks = computed(() => {
  return store.unassignedTasks;
});
function createTask() {
  store.createTask();
}
</script>
<template>
  <div id="taskArea">
    Tasks
    <button @click="createTask">+</button>
    <PairingTask v-for="task in tasks" :key="task.id" :task="task" />
  </div>
</template>
