import type { User } from "./schema.js";
var mysql = require('mysql2/promise');

let client

export abstract class AbstractUserCrud {
  abstract getAllUsers(): Promise<User[]>;
  abstract getUserByUsername(username: string): Promise<User | undefined>;
}

const createConnection = async() => {
  client = await mysql.createConnection({
  host: "163.44.123.178",
  port: 3306,
  user: "memoria",
  password: "daBJ&#sq2NF2xxoV",
  database: "memoria"
})
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