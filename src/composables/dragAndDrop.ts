import { useStore } from "@/stores/letspairStore";
import { ref, onMounted, onUnmounted, unref, watch, type Ref } from "vue";
export function useOnDragStart(
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
  watch(target, (value, oldValue) => {
    oldValue?.removeEventListener("dragstart", onDragStart);
    value?.addEventListener("dragstart", onDragStart);
  });
  //   onMounted(() => {
  //     if (target) {
  //       target.addEventListener("dragstart", onDragStart);
  //     }
  //   });
  onUnmounted(() => {
    // if (target) {
    //   target.removeEventListener("dragstart", onDragStart);
    // }
    unref(target)?.removeEventListener("dragstart", onDragStart);
  });

  return isDragged;
}
