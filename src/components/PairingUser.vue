<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import { addDraftItemToList } from "@/utils/dragAndDropUtils";
import type { User } from "@/models/User";
import { useOnDragStart } from "@/composables/dragAndDrop";
const userElement = ref<HTMLElement | null>(null);
const props = defineProps<{ user: User }>();
const userAsString = computed(() => {
  return JSON.stringify(props.user);
});
const isDragged = useOnDragStart(
  props.user.id,
  "user",
  userAsString.value,
  userElement
);
function onDragOver(event: DragEvent) {
  const userElementDOMRect = userElement.value?.getBoundingClientRect();
  const positionYDraggedElement = event.pageY;
  const draggedElementType = event.dataTransfer?.items[0].type;
  if (userElementDOMRect && positionYDraggedElement && draggedElementType) {
    addDraftItemToList(
      userElementDOMRect,
      positionYDraggedElement,
      draggedElementType,
      props.user.id
    );
  }
}
function onDragEnd() {
  isDragged.value = false;
}
</script>
<template>
  <div
    class="user"
    :class="{ draft: user.isDraft, dragged: isDragged }"
    draggable="true"
    @dragover="onDragOver($event)"
    @dragend="onDragEnd"
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
