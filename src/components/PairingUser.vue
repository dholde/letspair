<script setup lang="ts">
import { computed, ref } from "vue";
import type { User } from "@/models/User";
import { useDragAndDrop } from "@/composables/dragAndDrop";
const userElement = ref<HTMLElement | null>(null);
const props = defineProps<{ user: User }>();
const userAsString = computed(() => {
  return JSON.stringify(props.user);
});
const isDragged = useDragAndDrop(
  props.user.id,
  "user",
  userAsString.value,
  userElement
);
</script>
<template>
  <div
    class="user"
    :class="{ draft: user.isDraft, dragged: isDragged }"
    draggable="true"
    ref="userElement"
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
