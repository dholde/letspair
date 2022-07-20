import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import UserArea from "@/components/UserArea.vue";
import { createTestingPinia } from "@pinia/testing";
import { v4 as uuidv4 } from "uuid";

describe("UserArea", () => {
  it("creates new user when pressing the '+' button", async () => {
    const { getByRole, findByText } = render(UserArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const createUserButton = getByRole("button", { name: "+" });
    await fireEvent.click(createUserButton);
    await findByText("User Name");
  });
  it("contains only users that are not assigned to any PairingLane", async () => {
    const user1 = { id: uuidv4(), name: "Bruce Wayne", laneId: uuidv4() };
    const user2 = { id: uuidv4(), name: "Peter Parker", laneId: uuidv4() };
    const user3 = { id: uuidv4(), name: "Robert Bruce Banner", laneId: "" };
    const user4 = { id: uuidv4(), name: "Barry Allen" };
    const { queryByRole, queryByText } = render(UserArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                users: [user1, user2, user3, user4],
              },
            },
          }),
        ],
      },
    });
    const userListItems = queryByRole("listitems");
    expect(userListItems).toBeNull;
    const elementConatainingUserName1 = queryByText(user1.name);
    expect(elementConatainingUserName1).toBeNull();
    const elementConatainingUserName2 = queryByText(user2.name);
    expect(elementConatainingUserName2).toBeNull();
    const elementConatainingUserName3 = queryByText(user3.name);
    expect(elementConatainingUserName3?.innerHTML).toBe(user3.name);
    const elementConatainingUserName4 = queryByText(user4.name);
    expect(elementConatainingUserName4?.innerHTML).toBe(user4.name);
  });

  it("contains a user after dropping the user into the UserArea", async () => {
    const user = { id: uuidv4(), name: "John Wayne", laneId: uuidv4() };
    const { container, queryByText, findByText } = render(UserArea, {
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
    const queryUserNameResult = queryByText("John Wayne");
    expect(queryUserNameResult).toBeNull;
    const renderedComponent = container.firstElementChild;
    if (renderedComponent) {
      await fireEvent.drop(renderedComponent, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === "user") {
              return JSON.stringify(user);
            }
          },
        },
      });
      await findByText("John Wayne");
    } else {
      assert.fail("The UserArea component was not rendered.");
    }
  });
});
