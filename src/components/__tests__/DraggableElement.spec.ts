import { mount } from "@vue/test-utils";
import DraggableElement from "@/components/DraggableElement.vue";
import { v4 as uuidv4 } from "uuid";

describe("DraggableElement", () => {
  it("is a draggable element", () => {
    const wrapper = mount(DraggableElement);
    expect(wrapper.attributes("draggable")).toBe("true");
  });
});
it("should call onDrag function when start dragging the element", async () => {
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
