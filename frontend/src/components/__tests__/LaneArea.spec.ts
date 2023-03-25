import { describe, it, expect } from "vitest";
import { render, fireEvent, within, waitFor } from "@testing-library/vue";
import LaneArea from "@/components/LaneArea.vue";
import { nextTick } from "vue";
import { createTestingPinia } from "@pinia/testing";
import { retry } from "./Utils";
import { v4 as uuidv4 } from "uuid";

describe("LaneArea", () => {
  it("creates a new lanes when clicking on the '+' button", async () => {
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
  it("removes a user from a lane if the user is moved (dropped) to another lane", async () => {
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
      let userInput = renderedPairingLane1.querySelector("input");
      if (userInput) {
        expect(userInput.value).toEqual("John Wayne");
      } else {
        assert.fail("PairingUser should be in lane2");
      }
      expect(renderedPairingLane2.querySelector("input")).toBeUndefined;

      const dataTransferType = "user";
      await nextTick(); // Waiting for the next render cycle is necessary because the events handlers are registered via the watch function
      await fireEvent.drop(renderedPairingLane2, {
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
      expect(renderedPairingLane1.querySelector("input")).toBeUndefined;
      userInput = renderedPairingLane2.querySelector("input");
      if (userInput) {
        expect(userInput.value).toEqual("John Wayne");
      } else {
        assert.fail("PairingUser should be in lane2");
      }
    } else {
      assert.fail(
        `One of the pairing lanes or both were not rendered: PairingLane1: ${pairingLane1}, PairingLane2: ${pairingLane2}`
      );
    }
  });
});
