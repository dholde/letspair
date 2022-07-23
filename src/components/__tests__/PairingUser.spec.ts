import { render } from "@testing-library/vue";
import PairingUser from "@/components/PairingUser.vue";
import { v4 as uuidv4 } from "uuid";

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
});
