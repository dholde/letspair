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
      props: {
        task,
      },
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
      expect(store.$state.dragAndDropInfo.draggedItemId).toEqual(task.id);
    }
  });
});
