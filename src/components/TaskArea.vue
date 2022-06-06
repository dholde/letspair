<script setup lang="ts">
import { useStore } from "@/stores/letsPairStore";
const store = useStore();
function createTask() {
  store.createTask();
}
</script>
<template>
  <div id="taskArea">
    Tasks
    <button @click="createTask">+</button>
  </div>
</template>

<style>
.addButton {
  height: 20px;
  width: 20px;
}
</style>
