import { useStore } from "@/stores/letspairStore";
import { ref, onUnmounted, unref, watch, type Ref } from "vue";
export function useDragStartAndDragEnd(
  draggedItemId: string,
  dataTransferType: string,
  dataTransferData: string,
  target: Ref<EventTarget | null>
) {
  const isDragged = ref<boolean>(false);
  const store = useStore();
  function onDragStart(event: Event) {
    store.dragAndDropInfo.draggedItemId = draggedItemId;
    const dragEvent = event as DragEvent;
    dragEvent.dataTransfer?.setData(dataTransferType, dataTransferData);
    isDragged.value = true;
  }

  function onDragEnd() {
    isDragged.value = false;
  }
  watch(target, (value, oldValue) => {
    oldValue?.removeEventListener("dragstart", onDragStart);
    oldValue?.removeEventListener("dragend", onDragEnd);
    value?.addEventListener("dragstart", onDragStart);
    value?.addEventListener("dragend", onDragEnd);
  });
  onUnmounted(() => {
    unref(target)?.removeEventListener("dragstart", onDragStart);
    unref(target)?.removeEventListener("dragend", onDragEnd);
  });

  return isDragged;
}
