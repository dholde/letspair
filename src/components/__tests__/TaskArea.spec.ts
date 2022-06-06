import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import TaskArea from "@/components/TaskArea.vue";

describe("TaskArea", () => {
  it("creates new task when pressing the '+' button", async () => {
    const { getByText } = render(TaskArea);
    const createTaskButton = getByText("+");
    await fireEvent.click(createTaskButton);
    getByText("Add task description here");
  });
});
