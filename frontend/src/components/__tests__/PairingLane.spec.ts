import { describe, it } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import PairingLane from "@/components/PairingLane.vue";
import { nextTick } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@/models/Task";
//import { prettyDOM } from "@testing-library/dom";

describe("PairingLane", () => {
  it("should contain user after dropping a PairingUser element", async () => {
    const laneId = uuidv4();
    const userName = "John Wayne!";
    const user = {
      id: uuidv4(),
      name: userName,
      laneId: "",
    };
    const { container } = render(PairingLane, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                pairingBoard: {
                  lanes: [
                    {
                      id: laneId,
                      users: [],
                      tasks: [],
                    },
                  ],
                  users: [user],
                  tasks: [],
                },
              },
            },
          }),
        ],
      },
      props: {
        lane: {
          id: laneId,
        },
      },
    });

    const renderedComponent = container.firstElementChild;
    if (renderedComponent) {
      const dataTransferType = "user";
      await nextTick(); // Waiting for the next render cycle is necessary because the events handlers are registered via the watch function
      await fireEvent.drop(renderedComponent, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === dataTransferType) {
              return JSON.stringify(user);
            }
          },
          items: [
            {
              type: dataTransferType,
            },
          ],
        },
      });
      await nextTick();
      const pairingUserInput = renderedComponent.querySelector("input");
      if (pairingUserInput) {
        expect(pairingUserInput.value).toEqual(userName);
      } else {
        assert.fail("PairingUser should be in pairing lane");
      }
    } else {
      assert.fail("PairingLane component was not rendered.");
    }
  });

  it("should contain task after dropping a PairingTask element", async () => {
    const laneId = uuidv4();
    const task: Task = {
      id: uuidv4(),
      description: "This is an important task",
      order: 1,
    };
    const { findAllByRole, container } = render(PairingLane, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                pairingBoard: {
                  lanes: [
                    {
                      id: laneId,
                      users: [],
                      tasks: [],
                    },
                  ],
                  users: [],
                  tasks: [task],
                },
              },
            },
          }),
        ],
      },
      props: {
        lane: {
          id: laneId,
        },
      },
    });

    const renderedComponent = container.firstElementChild;
    if (renderedComponent) {
      const dataTransferType = "task";
      await nextTick(); // Waiting for the next render cycle is necessary because the events handlers are registered via the watch function
      await fireEvent.drop(renderedComponent, {
        dataTransfer: {
          getData: (dataType: string) => {
            if (dataType === dataTransferType) {
              return JSON.stringify(task);
            }
          },
          items: [
            {
              type: dataTransferType,
            },
          ],
        },
      });
      await nextTick();
      const taskListItems = await waitFor(async () => {
        return await findAllByRole("listitem");
      });
      const taskListItem = taskListItems[0];
      expect(taskListItem.innerHTML).toContain(task.description);
    } else {
      assert.fail("PairingLane component was not rendered.");
    }
  });
});
