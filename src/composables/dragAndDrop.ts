import { useStore } from "@/stores/letspairStore";
import type { Ref } from "vue";
import { useDragEventListener } from "./event";

export function useDragStartEvent(
  draggedItemId: string,
  dataTransferType: string,
  dataTransferData: string,
  target: Ref<HTMLElement | null>,
  isDragged: Ref<boolean>
) {
  const store = useStore();
  function onDragStart(event: DragEvent) {
    store.dragAndDropInfo.draggedItemId = draggedItemId;
    event.dataTransfer?.setData(dataTransferType, dataTransferData);
    isDragged.value = true;
  }
  useDragEventListener(target, "dragstart", onDragStart);
}

export function useDragEndEvent(
  target: Ref<HTMLElement | null>,
  isDragged: Ref<boolean>,
  itemType: "task" | "user"
) {
  const store = useStore();
  function onDragEnd() {
    isDragged.value = false;
    store.removeDraftItem(itemType);
  }
  useDragEventListener(target, "dragend", onDragEnd);
}

export function useDragOverEvent(
  draggedItemId: string,
  target: Ref<HTMLElement | null>
) {
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
  useDragEventListener(target, "dragover", onDragOver);
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
}

export function useDropEvent(
  target: Ref<HTMLElement | null>,
  laneId: string | undefined
) {
  async function onDrop(event: DragEvent) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer) {
      const dataTransferType = dataTransfer.items[0].type;
      const elementAsString: string = event.dataTransfer?.getData(
        dataTransferType
      ) as string;
      const elementFromDropEvent = JSON.parse(elementAsString);
      elementFromDropEvent.laneId = laneId;
      console.log(`Element from drop: ${JSON.stringify(elementFromDropEvent)}`);
      const store = useStore();
      store.updateLaneForItem(
        elementFromDropEvent.id,
        dataTransferType,
        laneId
      );
    }
  }
  useDragEventListener(target, "drop", onDrop);
}
