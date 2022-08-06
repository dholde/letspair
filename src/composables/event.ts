import { onUnmounted, type Ref, unref, watch } from "vue";

export function useDragEventListener(
  target: Ref<HTMLElement | null>,
  event: //TODO: Write type HTMLElementDragEventMap
  | "drag"
    | "dragend"
    | "dragenter"
    | "dragleave"
    | "dragover"
    | "dragstart"
    | "drop",
  callback: (event: DragEvent) => void
) {
  watch(target, (value, oldValue) => {
    oldValue?.removeEventListener(event, callback);
    value?.addEventListener(event, callback);
  });
  onUnmounted(() => {
    unref(target)?.removeEventListener(event, callback);
  });
}
