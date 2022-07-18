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
  it("Should remove user from lane if the same user is dropped on another lane", async () => {
    const [lane1, lane2] = [{ id: uuidv4() }, { id: uuidv4() }];
    const user = { id: uuidv4(), name: "John Wayne", laneId: lane1.id };
    const { getByRole } = render(LaneArea, {
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
    });
    const renderedListOfLanes = getByRole("list");
    const { findAllByRole } = within(renderedListOfLanes);
    const renderedLaneListItems = await findAllByRole("listitems");
    expect(renderedLaneListItems).toHaveLength(2);
  });
});
