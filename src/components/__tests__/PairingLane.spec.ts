import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import PairingLane from "@/components/PairingLane.vue";
import { debug } from "console";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@/models/Task";

describe("PairingLane", () => {
  it("should contain user after dropping a PairingUser element", async () => {
    const laneId = uuidv4();
    const userName = "John Wayne";
    const user = {
      id: uuidv4(),
      name: userName,
      laneId: "",
    };
    const { findAllByRole, container } = render(PairingLane, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: { users: [user] },
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
      const userListItems = await findAllByRole("listitem");
      const userListItem = userListItems[0];
      expect(userListItem.innerHTML).toContain(userName);
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
              letsPair: { tasks: [task] },
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
      const userListItems = await findAllByRole("listitem");
      const userListItem = userListItems[0];
      expect(userListItem.innerHTML).toContain(task.description);
    } else {
      assert.fail("PairingLane component was not rendered.");
    }
  });
});
