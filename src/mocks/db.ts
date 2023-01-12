import { factory, primaryKey, nullable } from "@mswjs/data";
import { faker } from "@faker-js/faker";

export const db = factory({
  user: {
    id: primaryKey(faker.datatype.uuid),
    order: Number,
    name: nullable(String),
    laneId: nullable(String),
  },
  task: {
    id: primaryKey(faker.datatype.uuid),
    description: String,
    order: Number,
    laneId: nullable(String),
  },
  lane: {
    id: primaryKey(faker.datatype.uuid),
  },
});

export const handlers = [
  ...db.user.toHandlers("rest"),
  ...db.task.toHandlers("rest"),
  ...db.lane.toHandlers("rest"),
];
