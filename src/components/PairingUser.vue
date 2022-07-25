<script setup lang="ts">
import { computed } from "vue";
import { dragStartHandler } from "@/utils/dragStartEventHandler";
const props = defineProps(["user"]);
const userAsString = computed(() => {
  return JSON.stringify(props.user);
});
</script>
<template>
  <div
    class="user"
    draggable="true"
    @dragstart="dragStartHandler('user', userAsString, $event)"
  >
    <div class="inner">
      {{ user.name ? user.name : "User Name" }}
    </div>
  </div>
</template>

<style>
.user {
  height: 2em;
  position: relative;
  background-color: var(--bg-color-task);
  margin: 5px;
}
.inner {
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
