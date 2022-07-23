<script setup lang="ts">
import PairingUser from "./PairingUser.vue";
import PairingTask from "./PairingTask.vue";
const props = defineProps(["user", "task"]);
function onDragStart(event: DragEvent) {
  const userAsString = JSON.stringify(props.user);
  event.dataTransfer?.setData("user", userAsString);
}
</script>
<template>
  <div draggable="true" @dragstart="onDragStart($event)">
    <PairingUser :user="user" v-if="user" />
    <PairingTask :task="task" v-if="task" />
  </div>
</template>
