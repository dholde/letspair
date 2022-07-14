<script setup lang="ts">
import { ref } from "vue";
defineProps(["lane"]);
const testText = ref("Test");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDrop(event: any) {
  event.preventDefault();
  testText.value = "Data transfer test";
}
</script>
<template>
  <div
    :id="lane.id"
    class="pairing-lane"
    @drop="onDrop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="users">{{ testText }}</div>
    <div class="tasks"></div>
  </div>
</template>
<style scoped>
.pairing-lane {
  margin: var(--margin-medium);
  padding: var(--padding-small);
  /*background-color: var(--bg-color-main);*/
  background-color: red;
}
.users {
  min-height: 35px;
}
.tasks {
  min-height: 50px;
}
</style>
