<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "@/stores/letspairStore";
import { dragStartHandler } from "@/utils/dragAndDropEventHandler";
const store = useStore();
const props = defineProps(["user"]);
const userAsString = computed(() => {
  return JSON.stringify(props.user);
});
function onDragStart(event: DragEvent) {
  store.dragAndDropInfo.draggedItemId = props.user.id;
  dragStartHandler("user", userAsString.value, event);
}
function onDragOver(event: DragEvent) {
  const dataTransferItemType = event.dataTransfer?.items[0].type;
  if (dataTransferItemType === "user") {
    if (
      store.dragAndDropInfo.draggedOverItemId !== props.user.id &&
      store.dragAndDropInfo.draggedItemId !== props.user.id
    ) {
      store.dragAndDropInfo.draggedOverItemId = props.user.id;
      if (store.dragAndDropInfo.draggedItemId) {
        store.addDraftUserToLane(
          store.dragAndDropInfo.draggedItemId,
          props.user.id
        );
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
  >
    <div class="inner">
      <!-- {{ user.name ? user.name : "User Name" }} -->
      {{ user.id }}
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
