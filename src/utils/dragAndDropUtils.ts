import { useStore } from "@/stores/letspairStore";

export function dragStartHandler(
  dataTransferType: string,
  dataTransferData: string,
  event: DragEvent
) {
  event.dataTransfer?.setData(dataTransferType, dataTransferData);
}

export function addDraftItemToList(
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
  if (draggedElementType === "user") {
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
        store.addDraftUserToLane(
          store.dragAndDropInfo.draggedItemId,
          draggedOverElementId,
          addAbove
        );
      }
    }
  }
}
