import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import LaneArea from "@/components/LaneArea.vue";
import { createTestingPinia } from "@pinia/testing";

describe("LaneArea", () => {
  it("Should create a new lane when clicking on the '+' button", async () => {
    const { getByRole, findByText, findAllByRole } = render(LaneArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const addLaneButton = getByRole("button", { name: "+" });
    await fireEvent.click(addLaneButton);
    await findByText("This is a lane");
    const listItems = await findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
  });
});
