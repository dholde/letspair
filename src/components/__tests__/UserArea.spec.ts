import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TaskArea from "@/components/UserArea.vue";
import { createTestingPinia } from "@pinia/testing";

describe("TaskArea", () => {
  it("creates new task when pressing the '+' button", async () => {
    const { getByRole, findByText } = render(TaskArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const createTaskButton = getByRole("button", { name: "+" });
    await fireEvent.click(createTaskButton);
    await findByText("User Name");
  });
});
