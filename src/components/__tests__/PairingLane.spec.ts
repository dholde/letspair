import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import PairingLane from "@/components/PairingLane.vue";

describe("PairingLane", () => {
  it("should contain user after dropping user element", async () => {
    const { findByText, container } = render(PairingLane, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });

    const renderedComponent = container.firstElementChild;
    if (renderedComponent) {
      await fireEvent.drop(renderedComponent, {
        dataTransfer: "Data transfer test",
      });
      await findByText("Data transfer test");
    }
  });
});
