import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import PairingLane from "@/components/PairingLane.vue";
import { debug } from "console";
import { v4 as uuidv4 } from "uuid";

describe("PairingLane", () => {
  it("should contain user after dropping user element", async () => {
    const laneId = uuidv4();
    const userName = "John Wayne";
    const user = {
      id: uuidv4(),
      name: userName,
      laneId: "",
    };
    const userId = uuidv4();
    const { findByText, findAllByRole, container } = render(PairingLane, {
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
      await fireEvent.drop(renderedComponent, {
        dataTransfer: "Data transfer test",
      });
      debug(renderedComponent);
      await findByText(userName);
      const userListItems = await findAllByRole("listitem");
      const userListItem = userListItems[0];
      console.log("Test");
    } else {
      assert.fail("PairingLane component was not rendered.");
    }
  });
});
