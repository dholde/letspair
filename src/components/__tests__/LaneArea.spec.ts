import { describe, it, expect } from "vitest";
import { render, fireEvent, within } from "@testing-library/vue";
import LaneArea from "@/components/LaneArea.vue";
import { createTestingPinia } from "@pinia/testing";
import { retry } from "./Utils";
import { v4 as uuidv4 } from "uuid";

describe("LaneArea", () => {
  it("Should create a new lanes when clicking on the '+' button", async () => {
    const { getByRole } = render(LaneArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const addLaneButton = getByRole("button", { name: "+" });
    const list = getByRole("list");
    const { findAllByRole } = within(list);
    await fireEvent.click(addLaneButton);
    let listItems = await findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    await fireEvent.click(addLaneButton);
    await fireEvent.click(addLaneButton);
    async function assertThree() {
      listItems = await findAllByRole("listitem");
      expect(listItems).toHaveLength(3);
    }
    // Retrying as the list items are added asynchronously.
    // Testing-library's find methods do not work here as there are already listitems in the list before. Meaning findAllByRole will always resolve immediately after first list item was added.
    await retry(assertThree, 1, 1000);
  });
  it("Should remove user from a lane if the same user is moved (dropped) to another lane", async () => {
    const pairingLane1 = { id: uuidv4() };
    const pairingLane2 = { id: uuidv4() };
    const user = { id: uuidv4(), name: "John Wayne", laneId: pairingLane1.id };
    const { baseElement } = render(LaneArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: { lanes: [pairingLane1, pairingLane2], users: [user] },
            },
          }),
        ],
      },
    });
    const renderedLaneArea = baseElement;
    const renderedPairingLane1 = Array.from(
      renderedLaneArea.querySelectorAll("div.pairing-lane")
    ).find((renderedPairingLane) => renderedPairingLane.id === pairingLane1.id);
    const renderedPairingLane2 = Array.from(
      renderedLaneArea.querySelectorAll("div.pairing-lane")
    ).find((renderedPairingLane) => renderedPairingLane.id === pairingLane2.id);
    if (renderedPairingLane1 && renderedPairingLane2) {
      expect(renderedPairingLane1.innerHTML).toContain("John Wayne");
      expect(renderedPairingLane2.innerHTML).not.toContain("John Wayne");

      await fireEvent.drop(renderedPairingLane2, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === "user") {
              return JSON.stringify(user);
            }
          },
        },
      });
      const renderedPairingLane2AsHTMLElement =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderedPairingLane2 as any as HTMLElement;
      const { findByText } = within(renderedPairingLane2AsHTMLElement);
      await findByText("John Wayne");
      expect(renderedPairingLane1.innerHTML).not.toContain("John Wayne");
    } else {
      assert.fail(
        `One of the pairing lanes or both were not rendered: PairingLane1: ${pairingLane1}, PairingLane2: ${pairingLane2}`
      );
    }
  });
});
