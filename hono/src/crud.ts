import type { User } from "./schema.js";

export abstract class AbstractUserCrud {
  abstract getAllUsers(): Promise<User[]>;
  abstract getUserByUsername(username: string): Promise<User | undefined>;
}

class DummyUserCrud extends AbstractUserCrud {
  users: User[];

  constructor() {
    super();
    this.users = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' },
        { username: 'user3', password: 'pass3' }
    ];
  }

  async getAllUsers() {
    return this.users;
  }

  async getUserByUsername(username: string) {
    return this.users.find(user => user.username === username);
  }
}

export const userCrud: AbstractUserCrud = new DummyUserCrud();