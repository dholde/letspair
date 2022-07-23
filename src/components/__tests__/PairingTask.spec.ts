import { mount } from "@vue/test-utils";
import { v4 as uuidv4 } from "uuid";
import PairingTask from "@/components/PairingTask.vue";
import type { Task } from "@/models/Task";

describe("PairingTask", () => {
  it("should call onDrag function when start dragging the element", async () => {
    const task: Task = {
      id: uuidv4(),
      description: "This is an important task",
      order: 1,
    };
    const dataTransferType = "task";
    const dataTransferData = JSON.stringify(task);
    const wrapper = mount(PairingTask, {
      props: {
        task,
      },
    });
    const onDragStart = vi.spyOn(wrapper.vm, "dragStartHandler");
    await wrapper.trigger("dragstart");
    expect(onDragStart).toHaveBeenCalledOnce();
    expect(onDragStart).toBeCalledWith(
      dataTransferType,
      dataTransferData,
      expect.objectContaining({ target: expect.any(HTMLDivElement) })
    );
    const taskElement = expect.objectContaining({
      target: expect.objectContaining({
        outerHTML: expect.stringContaining(task.description),
      }),
    });
    expect(onDragStart).toBeCalledWith(
      dataTransferType,
      dataTransferData,
      taskElement
    );
  });
});
