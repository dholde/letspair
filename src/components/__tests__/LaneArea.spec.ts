import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import LaneArea from "@/components/LaneArea.vue";
import { createTestingPinia } from "@pinia/testing";

describe("LaneArea", () => {
  it("Should create a new lane when clicking on the '+' button", async () => {
    const { getByRole, findByText } = render(LaneArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
  });
});
