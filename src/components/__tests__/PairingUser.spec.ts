import { mount } from "@vue/test-utils";
import PairingUser from "@/components/PairingUser.vue";
import { v4 as uuidv4 } from "uuid";

describe("PairingUser", () => {
  it("is a draggable element", () => {
    const user = { id: uuidv4(), name: "John Wayne" };
    const wrapper = mount(PairingUser, {
      props: {
        user,
      },
    });
    expect(wrapper.attributes("draggable")).toBe("true");
  });
});
it("should call onDrag function when start dragging the element", async () => {
  const user = { id: uuidv4(), name: "John Wayne" };
  const wrapper = mount(PairingUser, {
    props: {
      user,
    },
  });
  const onDragStart = vi.spyOn(wrapper.vm, "onDragStart");
  await wrapper.trigger("dragstart");
  expect(onDragStart).toHaveBeenCalledOnce();
  const arguments1 = expect(onDragStart).toBeCalledWith(
    expect.objectContaining({ target: expect.any(HTMLDivElement) })
  );
  const target = arguments1;
});
