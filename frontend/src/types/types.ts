import type { PrimaryKey } from "@mswjs/data/lib/primaryKey";

export type User = {
  id: PrimaryKey<string>;
  order: NumberConstructor;
  name: string | undefined;
  laneId: string | undefined;
};

export type Task = {
  id: PrimaryKey<string>;
  description: string | undefined;
  order: NumberConstructor;
  laneId: string | undefined;
  link: string | undefined;
  linkText: string | undefined;
  isCurrentlyDragged: boolean | undefined;
  isDraft: boolean | undefined;
};

export type Lane = {
  id: PrimaryKey<string>;
  tasks: Task[];
  users: User[];
};

export type PairingBoard = {
  id: PrimaryKey<string>;
  users: User[];
  tasks: Task[];
  lanes: Lane[];
};

export type Entities = {
  user: User;
  task: Task;
  lane: Lane;
  pairingBoard: PairingBoard;
};
export type Entity<T, U extends keyof T> = {
  [K in U]: T[K];
};

// export type Entity<T, U> = {
//   [K in keyof T]: T[K];
// } & { id: U };

// export type Entity<T, U> = ModelAPI<
//   {
//     user: User;
//     task: Task;
//     lane: Lane;
//     pairingBoard: PairingBoard;
//   },
//   U
// >;

// import { Entity, Task, Lane } from './types';

// // Now you can use the types
// const persistedLanes: Entity<Lane, "lane">[] = db.lane.getAll();
// const persistedTasks: Entity<Task, "task">[] = db.task.getAll();
// // and so on...
