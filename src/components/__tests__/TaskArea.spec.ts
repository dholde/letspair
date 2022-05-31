import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import TaskArea from "@/components/TaskArea.vue";
import { vi } from "vitest";

describe("TaskArea", () => {
  it("renders properly", () => {
    const wrapper = mount(TaskArea);
    expect(wrapper.text()).toContain("Tasks");
  });
});
