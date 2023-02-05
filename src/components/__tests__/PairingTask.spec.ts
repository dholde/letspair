import { mount } from "@vue/test-utils";
import { v4 as uuidv4 } from "uuid";
import PairingTask from "@/components/PairingTask.vue";
import type { Task } from "@/models/Task";
import { render, fireEvent } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { useStore } from "@/stores/letspairStore";
import { nextTick } from "vue";

describe("PairingTask", () => {
  it("should set 'isDragged' prop to ture when start dragging it", async () => {
    const task: Task = {
      id: uuidv4(),
      description: "Task 1",
      order: 1,
      laneId: "",
    };
    const { container } = render(PairingTask, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                tasks: [task],
              },
            },
          }),
        ],
      },
    });
    const taskComponent = container.firstElementChild;
    if (taskComponent) {
      await nextTick();
      await fireEvent.dragStart(taskComponent);
      const store = useStore();
      expect(store.$state.dragAndDropInfo.draggedItemId).toEqual("123");
    }
  });
  // it("should call onDrag function when start dragging the element", async () => {
  //   const task: Task = {
  //     id: uuidv4(),
  //     description: "This is an important task",
  //     order: 1,
  //   };
  //   const dataTransferType = "task";
  //   const dataTransferData = JSON.stringify(task);
  //   const wrapper = mount(PairingTask, {
  //     props: {
  //       task,
  //     },
  //   });
  //   const onDragStart = vi.spyOn(wrapper.vm, "dragStartHandler");
  //   await wrapper.trigger("dragstart");
  //   expect(onDragStart).toHaveBeenCalledOnce();
  //   expect(onDragStart).toBeCalledWith(
  //     dataTransferType,
  //     dataTransferData,
  //     expect.objectContaining({ target: expect.any(HTMLDivElement) })
  //   );
  //   const taskElement = expect.objectContaining({
  //     target: expect.objectContaining({
  //       outerHTML: expect.stringContaining(task.description),
  //     }),
  //   });
  //   expect(onDragStart).toBeCalledWith(
  //     dataTransferType,
  //     dataTransferData,
  //     taskElement
  //   );
  // });
});
