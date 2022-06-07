<script setup lang="ts">
import { useStore } from "@/stores/letsPairStore";
defineProps(["task"]);
</script>
<template>
  <div>{{ task.description }}</div>
</template>

<style>
.addButton {
  height: 20px;
  width: 20px;
}
</style>
