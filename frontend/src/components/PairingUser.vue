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
    data-test="user"
    class="user"
    :class="{ draft: user.isDraft, dragged: isDragged }"
    draggable="true"
    ref="userElement"
  >
    <div class="inner">
      <input
        :value="user.name"
        type="text"
        placeholder="Name"
        class="input"
        @focusout="updateUserName"
      />
    </div>
  </div>
</template>

<style scoped>
.user {
  background-color: var(
    --bg-color-task
  ); /* Consistent soft blue for user background */
  padding: var(--padding-small);
  /*margin-bottom: var(--margin-small);*/
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: var(--margin-small);
}

.user:hover {
  transform: translateY(-2px);
  background-color: var(--hover-bg-color); /* Soft hover effect */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.inner {
  width: 100%;
  position: relative;
}

.input {
  border: none;
  background-color: transparent;
  width: 100%;
  color: var(--text-color-primary);
  padding: var(--padding-small);
}

.input:focus {
  outline: none;
  box-shadow: inset 0 -2px 0 0 var(--input-focus-color);
}
</style>
