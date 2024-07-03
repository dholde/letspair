import { describe, it } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import { nextTick } from "vue";
import UserArea from "@/components/UserArea.vue";
import { createTestingPinia } from "@pinia/testing";
import { v4 as uuidv4 } from "uuid";
import { prettyDOM } from "@testing-library/dom";

describe("UserArea", () => {
  it("creates new user with placeholder text 'Name' when pressing the '+' button", async () => {
    const { getByRole, findByPlaceholderText } = render(UserArea, {
      global: {
        plugins: [createTestingPinia({ stubActions: false })],
      },
    });
    const createUserButton = getByRole("button", { name: "+" });
    await fireEvent.click(createUserButton);
    await findByPlaceholderText("Name");
  });
  it("contains only users that are not assigned to any PairingLane", async () => {
    const laneId1 = uuidv4();
    const laneId2 = uuidv4();
    const user1 = { id: uuidv4(), name: "Bruce Wayne", laneId: laneId1 };
    const user2 = { id: uuidv4(), name: "Peter Parker", laneId: laneId2 };
    const user3 = { id: uuidv4(), name: "Robert Bruce Banner", laneId: "" };
    const user4 = { id: uuidv4(), name: "Barry Allen" };
    const { findAllByPlaceholderText } = render(UserArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                pairingBoard: {
                  lanes: [
                    { id: laneId1, name: "Lane 1", users: [user1] },
                    { id: laneId2, name: "Lane 2", users: [user2] },
                  ],
                  users: [user3, user4],
                  tasks: [],
                },
              },
            },
          }),
        ],
      },
    });
    await nextTick();
    const pairingUserElements = await findAllByPlaceholderText("Name");
    const usersExpectedInLane = pairingUserElements.filter(
      (userInput) =>
        (userInput as HTMLFormElement).value === user3.name ||
        (userInput as HTMLFormElement).value === user4.name
    );
    expect(usersExpectedInLane).length(2);
    const userNotExpectedInLane = pairingUserElements.filter(
      (userInput) =>
        (userInput as HTMLFormElement).value === user1.name ||
        (userInput as HTMLFormElement).value === user2.name
    );
    expect(userNotExpectedInLane).length(0);
  });

  it("contains a user after dropping the user into the UserArea", async () => {
    const user = { id: uuidv4(), name: "John Wayne", laneId: uuidv4() };
    const laneId = uuidv4();
    const { container, queryByText, findByPlaceholderText } = render(UserArea, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false,
            initialState: {
              letsPair: {
                pairingBoard: {
                  lanes: [{ id: laneId, users: [user] }],
                  users: [],
                  tasks: [],
                },
              },
            },
          }),
        ],
      },
    });
    const queryUserNameResult = queryByText("John Wayne");
    expect(queryUserNameResult).toBeNull;
    const dropZone = container.firstElementChild;

    if (dropZone) {
      await nextTick(); // Waiting for the next render cycle is necessary because the events handlers are registered via the watch function
      await fireEvent.drop(dropZone, {
        dataTransfer: {
          getData: function (dataType: string) {
            if (dataType === "user") {
              return JSON.stringify(user);
            }
          },
          items: [{ type: "user" }],
        },
      });
      await nextTick();
      const pairingUserElement = await findByPlaceholderText("Name");
      if (pairingUserElement) {
        expect((pairingUserElement as HTMLFormElement).value).toEqual(
          "John Wayne"
        );
      } else {
        assert.fail("Cannot find dropped user in lane");
      }
    } else {
      assert.fail("The UserArea component was not rendered.");
    }
  });
});
