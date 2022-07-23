import { mount } from "@vue/test-utils";
import PairingUser from "@/components/PairingUser.vue";
import { v4 as uuidv4 } from "uuid";
import { render } from "@testing-library/vue";

describe("PairingUser", () => {
  it("shows the user name", () => {
    const user = { id: uuidv4(), name: "John Wayne" };
    const { findByText } = render(PairingUser, {
      props: {
        user,
      },
    });
    findByText("John Wayne");
  });
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
  const dataTransferType = "user";
  const dataTransferData = JSON.stringify(user);
  const wrapper = mount(PairingUser, {
    props: {
      user,
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
  const userElement = expect.objectContaining({
    target: expect.objectContaining({
      outerHTML: expect.stringContaining(`John Wayne`),
    }),
  });
  expect(onDragStart).toBeCalledWith(
    dataTransferType,
    dataTransferData,
    userElement
  );
});
