import type { User } from "./schema.js";
// var mysql = require('mysql2/promise');
import * as mysql from "mysql2/promise";

let client: mysql.Connection;

/**
 * DB接続生成
 * DB操作時に接続、クローズをする
 */

const createConnection = async () => {
  client = await mysql.createConnection({
    host: "163.44.123.178",
    port: 3306,
    user: "userName",
    password: "daBJ&#sq2NF2xxoV",
    database: "memoria",
  });
};

export abstract class AbstractUserCrud {
  abstract getAllUsers(): Promise<User[]>;
  abstract getUserByUsername(username: string): Promise<User | undefined>;
}

/**
 * ユーザー一覧取得
 * @returns ユーザー情報
 */
const getUserList = async () => {
  await createConnection();
  const [rows, fields] = await client.execute("select * from users");
  await client.end();
  return rows;
};

/**
 * ユーザー登録
 */
const registerUser = async (userName: string) => {
  await createConnection();
  const [result, filelds] = await client.query(
    `INSERT INTO users VALUES (0, '${userName}')`
  );
  await client.end();
  return result;
};

class UserCrud extends AbstractUserCrud {
  async getAllUsers() {
    const rows = await getUserList();
    return rows as User[];
  }

  async getUserByUsername(username: string) {
    const rows = await getUserList();
    const users = rows as User[];
    return users.find((user) => user.username === username);
  }
}

class DummyUserCrud extends AbstractUserCrud {
  users: User[];

  constructor() {
    super();
    this.users = [
      { username: "user1", password: "pass1" },
      { username: "user2", password: "pass2" },
      { username: "user3", password: "pass3" },
    ];
  }

  async getAllUsers() {
    return this.users;
  }

  async getUserByUsername(username: string) {
    return this.users.find((user) => user.username === username);
  }
}

export const userCrud: AbstractUserCrud = new UserCrud();
