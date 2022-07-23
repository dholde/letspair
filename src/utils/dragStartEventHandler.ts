export const onDragStart = (
  dataTransferType: string,
  dataTransferData: string,
  event: DragEvent
) => {
  event.dataTransfer?.setData(dataTransferType, dataTransferData);
};
