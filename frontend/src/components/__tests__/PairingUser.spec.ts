import { mount } from "@vue/test-utils";
import PairingUser from "@/components/PairingUser.vue";
import { v4 as uuidv4 } from "uuid";
import { render, fireEvent } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { nextTick } from "vue";
import type { User } from "@/models/User";
import { useStore } from "@/stores/letspairStore";

describe("PairingUser", () => {
  it("shows the user name", () => {
    const user = { id: uuidv4(), name: "John Wayne" };
    const { findByText } = render(PairingUser, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
          }),
        ],
      },
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
  it("should set 'isDragged' prop to ture when start dragging it", async () => {
    const user: User = {
      id: uuidv4(),
      order: 1,
      laneId: "",
    };
    const wrapper = mount(PairingUser, {
      props: {
        user,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                users: [user],
              },
            },
          }),
        ],
      },
    });
    if (wrapper) {
      await nextTick();

      await wrapper.vm.$nextTick();
      const draggedTask = wrapper.find('[data-test="user"]');
      draggedTask.trigger("dragstart");
      await wrapper.vm.$nextTick();
      expect(draggedTask.classes()).toContain("dragged");
    }
  });
  it("should set 'draggedItemId' in store model to the id of the dragged task", async () => {
    const user: User = {
      id: uuidv4(),
      order: 1,
      laneId: "",
    };
    const { container } = render(PairingUser, {
      props: {
        user,
      },
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                users: [user],
              },
            },
          }),
        ],
      },
    });
    const taskComponent = container.firstElementChild;
    if (taskComponent) {
      await nextTick();
      await fireEvent.dragStart(taskComponent);
      const store = useStore();
      expect(store.$state.dragAndDropInfo.draggedItemId).toEqual(user.id);
    }
  });
});
