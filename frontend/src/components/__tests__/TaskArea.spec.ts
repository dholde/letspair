import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TaskArea from "@/components/TaskArea.vue";
import { nextTick } from "vue";
import { createTestingPinia } from "@pinia/testing";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@/models/Task";
describe("TaskArea", () => {
  it("creates new task when pressing the '+' button", async () => {
    const { getByRole, findByPlaceholderText } = render(TaskArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const createTaskButton = getByRole("button", { name: "+" });
    await fireEvent.click(createTaskButton);
    await findByPlaceholderText("Add the task description here");
  });
  it("contains only tasks that are not assigned to any PairingLane", async () => {
    const laneId1 = uuidv4();
    const laneId2 = uuidv4();
    const task1: Task = {
      id: uuidv4(),
      description: "Task 1",
      order: 1,
      laneId: laneId1,
    };
    const task2: Task = {
      id: uuidv4(),
      description: "Task 2",
      order: 2,
      laneId: laneId2,
    };
    const task3: Task = { id: uuidv4(), description: "Task 3", order: 3 };
    const task4: Task = { id: uuidv4(), description: "Task 4", order: 4 };
    const { queryByRole, queryByText, findByText } = render(TaskArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                pairingBoard: {
                  id: uuidv4(),
                  lanes: [
                    {
                      id: laneId1,
                      users: [],
                      tasks: [task1],
                    },
                    {
                      id: laneId2,
                      users: [],
                      tasks: [task2],
                    },
                  ],
                  users: [],
                  tasks: [task3, task4],
                },
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
    const elementConatainingtaskName3 = await findByText(task3.description);
    expect(elementConatainingtaskName3?.innerHTML).toBe(task3.description);
    const elementConatainingtaskName4 = queryByText(task4.description);
    expect(elementConatainingtaskName4?.innerHTML).toBe(task4.description);
  });
  it("contains a task after dropping the task into the taskArea", async () => {
    const laneId = uuidv4();
    const originalTask: Task = {
      id: uuidv4(),
      description: "Task 1",
      order: 1,
      laneId: laneId,
    };
    const draftTask: Task = {
      id: uuidv4(),
      description: "Task 1",
      order: 1,
      laneId: laneId,
      isDraft: true,
    };
    const { container, queryByText, findByText } = render(TaskArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                pairingBoard: {
                  id: uuidv4(),
                  lanes: [
                    {
                      id: laneId,
                      users: [],
                      tasks: [originalTask],
                    },
                  ],
                  users: [],
                  tasks: [draftTask],
                },
              },
            },
          }),
        ],
      },
    });
    const querytaskNameResult = queryByText(originalTask.description);
    expect(querytaskNameResult).toBeNull;
    const dropZone = container.firstElementChild;

    if (dropZone) {
      await nextTick(); // Waiting for the next render cycle is necessary because the events handlers are registered via the watch function
      await fireEvent.drop(dropZone, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === "task") {
              return JSON.stringify(originalTask);
            }
          },
          items: [{ type: "task" }],
        },
      });
      await nextTick();
      await findByText(originalTask.description);
    } else {
      assert.fail("The taskArea component was not rendered.");
    }
  });
});
