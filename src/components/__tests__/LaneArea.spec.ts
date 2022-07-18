import { describe, it, expect } from "vitest";
import { render, fireEvent, within } from "@testing-library/vue";
import LaneArea from "@/components/LaneArea.vue";
import { createTestingPinia } from "@pinia/testing";
import { retry } from "./Utils";
import { v4 as uuidv4 } from "uuid";
import { debug } from "console";

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
  it("Should remove user from lane if the same user is moved (dropped) to another lane", async () => {
    const pairingLane1 = { id: uuidv4() };
    const pairingLane2 = { id: uuidv4() };
    const user = { id: uuidv4(), name: "John Wayne", laneId: pairingLane1.id };
    const { baseElement, getAllByRole } = render(LaneArea, {
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
    const elementsWithId = renderedLaneArea.querySelectorAll("li.pairing-lane");
    console.log(elementsWithId.length);
    Array.from(elementsWithId).forEach(function (el) {
      console.log(el.getAttribute("id"));
    });
    const renderedListOfLanes = getAllByRole("list");
    const renderedPairingLane1 = Array.from(
      renderedLaneArea.querySelectorAll("div.pairing-lane")
    ).filter(
      (renderedPairingLane) => renderedPairingLane.id === pairingLane1.id
    );
    const renderedPairingLane2 = Array.from(
      renderedLaneArea.querySelectorAll("div.pairing-lane")
    ).filter(
      (renderedPairingLane) => renderedPairingLane.id === pairingLane2.id
    );
    const id = renderedLaneArea.querySelectorAll("div.pairing-lane")[0].id;
    debug;
    // const { findAllByRole } = within(renderedListOfLanes);
    // const renderedLaneListItems = await findAllByRole("listitems");
    // expect(renderedLaneListItems).toHaveLength(2);
  });
});
