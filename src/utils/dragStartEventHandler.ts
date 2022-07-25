export function dragStartHandler(
  dataTransferType: string,
  dataTransferData: string,
  event: DragEvent
) {
  event.dataTransfer?.setData(dataTransferType, dataTransferData);
}
