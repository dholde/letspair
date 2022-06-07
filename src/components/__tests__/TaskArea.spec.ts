import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TaskArea from "@/components/TaskArea.vue";
import { createTestingPinia } from "@pinia/testing";

describe("TaskArea", () => {
  it("creates new task when pressing the '+' button", async () => {
    const { getByRole, getByText, findByText } = render(TaskArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const createTaskButton = getByRole("button", { name: "+" });
    await fireEvent.click(createTaskButton);
    console.log(`assert ...`);
    await findByText("Very important task 1");
  });
});
