import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import DeletionArea from "@/components/DeletionArea.vue";
import { nextTick } from "vue";
import { createTestingPinia } from "@pinia/testing";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@/models/Task";
import { useStore } from "@/stores/letspairStore";
describe("DeletionArea", () => {
  it("deletes items when dropped into deletion area", async () => {
    const task1: Task = { id: uuidv4(), description: "Task 1", order: 1 };
    const task2: Task = { id: uuidv4(), description: "Task 2", order: 2 };
    const user1 = { id: uuidv4(), name: "User 1" };
    const user2 = { id: uuidv4(), name: "User 2" };
    const { container } = render(DeletionArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                tasks: [task1, task2],
                users: [user1, user2],
              },
            },
          }),
        ],
      },
    });
    const dropZone = container.firstElementChild;
    if (dropZone) {
      await nextTick();
      await fireEvent.drop(dropZone, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === "task") {
              return JSON.stringify(task1);
            }
          },
          items: [{ type: "task" }],
        },
      });
      await fireEvent.drop(dropZone, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === "user") {
              return JSON.stringify(user1);
            }
          },
          items: [{ type: "user" }],
        },
      });
      await nextTick();
      const store = useStore();
      expect(store.$state.tasks).length(1);
      expect(store.$state.users).length(1);
    } else {
      assert.fail("The taskArea component was not rendered.");
    }
  });
});
