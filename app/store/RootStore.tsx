// stores/RootStore.ts

import { UserTaskStore } from "./user-task.store";


export class RootStore {
  userTaskStore: UserTaskStore;

  constructor() {
    this.userTaskStore = new UserTaskStore();
  }
}

export const rootStore = new RootStore();
