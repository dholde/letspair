import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TaskArea from "@/components/TaskArea.vue";
import { nextTick } from "vue";
import { createTestingPinia } from "@pinia/testing";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@/models/Task";
describe("TaskArea", () => {
  it("creates new task when pressing the '+' button", async () => {
    const { getByRole, findByText } = render(TaskArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const createTaskButton = getByRole("button", { name: "+" });
    await fireEvent.click(createTaskButton);
    await findByText("Add a task decription here");
  });
  it("contains only tasks that are not assigned to any PairingLane", async () => {
    const task1: Task = {
      id: uuidv4(),
      description: "Task 1",
      order: 1,
      laneId: uuidv4(),
    };
    const task2: Task = {
      id: uuidv4(),
      description: "Task 2",
      order: 2,
      laneId: uuidv4(),
    };
    const task3: Task = { id: uuidv4(), description: "Task 3", order: 3 };
    const task4: Task = { id: uuidv4(), description: "Task 4", order: 4 };
    const { queryByRole, queryByText } = render(TaskArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                tasks: [task1, task2, task3, task4],
              },
            },
          }),
        ],
      },
    });
    const taskListItems = queryByRole("listitems");
    expect(taskListItems).toBeNull;
    const elementConatainingtaskName1 = queryByText(task1.description);
    expect(elementConatainingtaskName1).toBeNull();
    const elementConatainingtaskName2 = queryByText(task2.description);
    expect(elementConatainingtaskName2).toBeNull();
    const elementConatainingtaskName3 = queryByText(task3.description);
    expect(elementConatainingtaskName3?.innerHTML).toBe(task3.description);
    const elementConatainingtaskName4 = queryByText(task4.description);
    expect(elementConatainingtaskName4?.innerHTML).toBe(task4.description);
  });
  it("contains a task after dropping the task into the taskArea", async () => {
    const task: Task = {
      id: uuidv4(),
      description: "Task 1",
      order: 1,
      laneId: uuidv4(),
    };
    const { container, queryByText, findByText } = render(TaskArea, {
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
    const querytaskNameResult = queryByText(task.description);
    expect(querytaskNameResult).toBeNull;
    const dropZone = container.firstElementChild;
    if (dropZone) {
      await nextTick(); // Waiting for the next render cycle is necessary because the events handlers are registered via the watch function
      await fireEvent.drop(dropZone, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === "task") {
              return JSON.stringify(task);
            }
          },
          items: [{ type: "task" }],
        },
      });
      await findByText(task.description);
    } else {
      assert.fail("The taskArea component was not rendered.");
    }
  });
});
