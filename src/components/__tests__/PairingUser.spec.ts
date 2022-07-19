import { mount } from "@vue/test-utils";
import PairingUser from "@/components/PairingUser.vue";
import { v4 as uuidv4 } from "uuid";

describe("PairingUser", () => {
  it("Should be draggable", () => {
    const user = { id: uuidv4(), name: "John Wayne" };
    const wrapper = mount(PairingUser, {
      props: {
        user,
      },
    });
    expect(wrapper.attributes("draggable")).toBe("true");
  });
});
