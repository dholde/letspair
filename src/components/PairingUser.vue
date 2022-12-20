<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { User } from "@/models/User";
import { useStore } from "@/stores/letspairStore";
import {
  useDragEndEvent,
  useDragOverEvent,
  useDragStartEvent,
} from "@/composables/dragAndDrop";
const store = useStore();
const userElement = ref<HTMLElement | null>(null);
const props = defineProps<{ user: User }>();
const userAsString = computed(() => {
  return JSON.stringify(props.user);
});
var isDragged = ref<boolean>(false);

useDragStartEvent(
  props.user.id,
  "user",
  userAsString.value,
  userElement,
  isDragged
);
useDragEndEvent(userElement, isDragged, "user");
useDragOverEvent(props.user.id, userElement);

function updateUserName(event: Event) {
  const userName = (event.target as HTMLInputElement).value;
  if (userName) {
    store.updateUserName(props.user.id, userName);
  }
}
</script>
<template>
  <div
    class="user"
    :class="{ draft: user.isDraft, dragged: isDragged }"
    draggable="true"
    ref="userElement"
  >
    <div class="inner">
      <div class="inner">
        {{ user.name ? user.name : "User Name" }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.user {
  height: 2em;
  position: relative;
  background-color: var(--bg-color-task);
  margin: 3px;
}
.inner {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
  width: 100%;
}

/* input {
  position: relative;
  border-width: 0px;
  border: none;
  background-color: transparent;
  padding: 5px;
  height: 100%;
  width: 100%;
  -webkit-box-sizing: border-box; 
  -moz-box-sizing: border-box; 
} */

/* input:focus {
  outline: 3px solid var(--input-focus-color);
} */
</style>
