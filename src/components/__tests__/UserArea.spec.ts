import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import UserArea from "@/components/UserArea.vue";
import { createTestingPinia } from "@pinia/testing";

describe("UserArea", () => {
  it("creates new user when pressing the '+' button", async () => {
    const { getByRole, findByText } = render(UserArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const createUserButton = getByRole("button", { name: "+" });
    await fireEvent.click(createUserButton);
    await findByText("User Name");
  });
});
