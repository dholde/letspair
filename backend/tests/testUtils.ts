import request from "supertest";
import { UserModel } from "../src/model";
import { ObjectId } from "mongodb";
import { Express } from "express";
export async function setupUsersTestData(app: Express) {
  const preparedUserData = {
    laneId: ObjectId,
    user1: UserModel,
    user2: UserModel,
    user3: UserModel,
    user4: UserModel,
    user5: UserModel,
    user6: UserModel,
  };
  let response = await request(app).post("/users").send(userData.user1);
  preparedUserData.user1 = response;
  response = await request(app).post("/users").send(userData.user2);
  preparedUserData.user2 = response;
  response = await request(app).post("/users").send(userData.user3);
  preparedUserData.user2 = response;
}

const laneId = new ObjectId().toString();
const userData = {
  laneId,
  user1: {
    name: "User1",
    laneId: "",
    order: 0,
  },
  user2: {
    name: "User2",
    laneId: "",
    order: 1,
  },
  user3: {
    name: "User3",
    laneId: "",
    order: 2,
  },
  user4: {
    name: "User4",
    laneId: "",
    order: 3,
  },
  user5: {
    name: "User5",
    laneId: laneId,
    order: 0,
  },
  user6: {
    name: "User6",
    laneId: laneId,
    order: 1,
  },
};
