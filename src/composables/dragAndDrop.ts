import { useStore } from "@/stores/letspairStore";
import { ref, onUnmounted, unref, watch, type Ref } from "vue";
export function useDragAndDrop(
  draggedItemId: string,
  dataTransferType: string,
  dataTransferData: string,
  target: Ref<HTMLElement | null>
) {
  const isDragged = ref<boolean>(false);
  const store = useStore();
  function onDragStart(event: DragEvent) {
    store.dragAndDropInfo.draggedItemId = draggedItemId;
    event.dataTransfer?.setData(dataTransferType, dataTransferData);
    isDragged.value = true;
  }

  function onDragOver(event: DragEvent) {
    const userElementDOMRect = target.value?.getBoundingClientRect();
    const positionYDraggedElement = event.pageY;
    const draggedElementType = event.dataTransfer?.items[0].type;
    if (userElementDOMRect && positionYDraggedElement && draggedElementType) {
      addDraftItemToList(
        userElementDOMRect,
        positionYDraggedElement,
        draggedElementType,
        draggedItemId
      );
    }
  }

  function addDraftItemToList(
    draggedOverElementDOMRect: DOMRect,
    draggedElementYPosition: number,
    draggedElementType: string,
    draggedOverElementId: string
  ) {
    const store = useStore();
    const addAbove =
      draggedOverElementDOMRect.y + draggedOverElementDOMRect.height / 2 >
      draggedElementYPosition
        ? true
        : false;
    const addAboveOriginal = store.dragAndDropInfo.addAbove;
    if (
      (store.dragAndDropInfo.draggedOverItemId !== draggedOverElementId &&
        store.dragAndDropInfo.draggedItemId !== draggedOverElementId) ||
      (store.dragAndDropInfo.draggedItemId !== draggedOverElementId &&
        addAboveOriginal !== null &&
        addAboveOriginal !== addAbove)
    ) {
      store.dragAndDropInfo.addAbove = addAbove;
      store.dragAndDropInfo.draggedOverItemId = draggedOverElementId;
      if (store.dragAndDropInfo.draggedItemId) {
        if (draggedElementType === "user") {
          store.addDraftUserToLane(
            store.dragAndDropInfo.draggedItemId,
            draggedOverElementId,
            addAbove
          );
        } else if (draggedElementType === "task") {
          store.addDraftTaskToLane(
            store.dragAndDropInfo.draggedItemId,
            draggedOverElementId,
            addAbove
          );
        }
      }
    }
  }

  function onDragEnd() {
    isDragged.value = false;
  }
  watch(target, (value, oldValue) => {
    oldValue?.removeEventListener("dragstart", onDragStart);
    oldValue?.removeEventListener("dragend", onDragEnd);
    oldValue?.removeEventListener("dragover", onDragOver);
    value?.addEventListener("dragstart", onDragStart);
    value?.addEventListener("dragend", onDragEnd);
    value?.addEventListener("dragover", onDragOver);
  });
  onUnmounted(() => {
    unref(target)?.removeEventListener("dragstart", onDragStart);
    unref(target)?.removeEventListener("dragend", onDragEnd);
    unref(target)?.removeEventListener("dragover", onDragOver);
  });

  return isDragged;
}
