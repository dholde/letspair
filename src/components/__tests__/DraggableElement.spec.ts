import { mount } from "@vue/test-utils";
import DraggableElement from "@/components/DraggableElement.vue";
import { v4 as uuidv4 } from "uuid";
import type Task from "@/models/Task";

describe("DraggableElement", () => {
  it("is a draggable element", () => {
    const wrapper = mount(DraggableElement);
    expect(wrapper.attributes("draggable")).toBe("true");
  });
  it("PairingUser.vue component calls the onDrag function in case the 'user' prop is set", async () => {
    const user = { id: uuidv4(), name: "John Wayne" };
    const wrapper = mount(DraggableElement, {
      props: {
        user,
      },
    });
    const onDragStart = vi.spyOn(wrapper.vm, "onDragStart");
    await wrapper.trigger("dragstart");
    expect(onDragStart).toHaveBeenCalledOnce();
    expect(onDragStart).toBeCalledWith(
      expect.objectContaining({ target: expect.any(HTMLDivElement) })
    );
    const userElement = expect.objectContaining({
      target: expect.objectContaining({
        outerHTML:
          expect.stringContaining(`class="user"`) &&
          expect.stringContaining(user.name),
      }),
    });
    expect(onDragStart).toBeCalledWith(userElement);
  });
  it("PairingTask.vue component calls the onDrag function in case the 'task' prop is set", async () => {
    const task: Task = {
      id: uuidv4(),
      description: "This is an important task",
    };
    const wrapper = mount(DraggableElement, {
      props: {
        task,
      },
    });
    const onDragStart = vi.spyOn(wrapper.vm, "onDragStart");
    await wrapper.trigger("dragstart");
    expect(onDragStart).toHaveBeenCalledOnce();
    expect(onDragStart).toBeCalledWith(
      expect.objectContaining({ target: expect.any(HTMLDivElement) })
    );
    const taskElement = expect.objectContaining({
      target: expect.objectContaining({
        outerHTML:
          expect.stringContaining(`class="task"`) &&
          expect.stringContaining(task.description),
      }),
    });
    expect(onDragStart).toBeCalledWith(taskElement);
  });
});
