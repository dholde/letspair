<script setup lang="ts">
function createTask() {
  alert("Test");
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
