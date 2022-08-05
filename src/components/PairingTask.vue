<script setup lang="ts">
import { computed, ref } from "vue";
import { addDraftItemToList } from "@/utils/dragAndDropUtils";
import { useOnDragStart } from "@/composables/dragAndDrop";

const props = defineProps(["task"]);
const taskAsString = computed(() => JSON.stringify(props.task));
const taskElement = ref<HTMLElement | null>(null);
const isDragged = useOnDragStart(
  props.task.id,
  "task",
  taskAsString.value,
  taskElement
);
function onDragOver(event: DragEvent) {
  const userElementDOMRect = taskElement.value?.getBoundingClientRect();
  const positionYDraggedElement = event.pageY;
  const draggedElementType = event.dataTransfer?.items[0].type;
  if (userElementDOMRect && positionYDraggedElement && draggedElementType) {
    addDraftItemToList(
      userElementDOMRect,
      positionYDraggedElement,
      draggedElementType,
      props.task.id
    );
  }
}
function onDragEnd() {
  isDragged.value = false;
}
</script>
<template>
  <div
    class="task"
    draggable="true"
    :class="{ draft: task.isDraft, dragged: isDragged }"
    @dragover="onDragOver($event)"
    @dragend="onDragEnd"
    ref="taskElement"
  >
    <div class="inner">
      {{
        task.description !== ""
          ? task.description
          : "Add a task decription here"
      }}
    </div>
  </div>
</template>

<style>
.task {
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
