<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "@/stores/letspairStore";
import { dragStartHandler } from "@/utils/dragAndDropEventHandler";
import type { User } from "@/models/User";
const userElement = ref<HTMLElement | null>(null);
const store = useStore();
const props = defineProps<{ user: User }>();
const userAsString = computed(() => {
  return JSON.stringify(props.user);
});
function onDragStart(event: DragEvent) {
  store.dragAndDropInfo.draggedItemId = props.user.id;
  dragStartHandler("user", userAsString.value, event);
}
function onDragOver(event: DragEvent) {
  const positionY = userElement.value?.getBoundingClientRect().y;
  const height = userElement.value?.getBoundingClientRect().height;
  const positionYDraggedElement = event.pageY;
  if (positionY && height && positionYDraggedElement) {
    const addAbove =
      positionY + height / 2 > positionYDraggedElement ? true : false;
    const addAboveOriginal = store.dragAndDropInfo.addAbove;
    const dataTransferItemType = event.dataTransfer?.items[0].type;
    if (dataTransferItemType === "user") {
      if (
        (store.dragAndDropInfo.draggedOverItemId !== props.user.id &&
          store.dragAndDropInfo.draggedItemId !== props.user.id) ||
        (store.dragAndDropInfo.draggedItemId !== props.user.id &&
          addAboveOriginal !== null &&
          addAboveOriginal !== addAbove)
      ) {
        store.dragAndDropInfo.addAbove = addAbove;
        store.dragAndDropInfo.draggedOverItemId = props.user.id;
        if (store.dragAndDropInfo.draggedItemId) {
          store.addDraftUserToLane(
            store.dragAndDropInfo.draggedItemId,
            props.user.id,
            addAbove
          );
        }
      }
    }
  }
}
</script>
<template>
  <div
    class="user"
    :class="{ draft: user.isDraft }"
    draggable="true"
    @dragstart="onDragStart($event)"
    @dragover="onDragOver($event)"
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
.draft {
  opacity: 0.2;
}
</style>
