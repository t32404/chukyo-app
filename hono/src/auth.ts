import { AbstractUserCrud, userCrud } from "./crud.js";
import type { Token, User } from "./schema.js";
import { sign, verify } from "hono/jwt";

const TOKEN_EXPIRATION_MINUTES = 5;

if (!process.env.SECRET) {
  throw new Error("SECRET environment variable is not set.");
}

const SECRET = process.env.SECRET;

function getTokenExp() {
    return Math.floor(Date.now() / 1000) + 60 * TOKEN_EXPIRATION_MINUTES;
}

/**
 * 認証を行うためのサービスを表す抽象クラス。
 */
export abstract class AbstractAuthService {
    userCrud: AbstractUserCrud;

    /**
     * 認証を行うサービスを初期化します。
     * @param userCrud ユーザーの読み取りに使うUserCrud。
     */
    constructor(userCrud: AbstractUserCrud) {
        this.userCrud = userCrud;
    }

    /**
     * 指定されたユーザー名とパスワードで認証を行い、トークンを返します。
     * 認証に失敗した場合、例外がスローされます。
     * @param username 認証するユーザーの名前。
     * @param password 認証するユーザーのパスワード。
     */
    abstract login(username: string, password: string): Promise<string>;

    /**
     * トークンが有効かどうかを検査し、有効である場合はユーザーを返します。
     * @param token 検査するトークン。
     */
    abstract getUser(token: string): Promise<User>;

    /**
     * トークンが有効かどうかを検査し、有効である場合はtrueを、そうでない場合はfalseを返します。
     * @param token 検査するトークン。
     */
    abstract check(token: string): Promise<boolean>;
}

export abstract class AbstractLoginError extends Error {}

export class UserNotFoundError extends AbstractLoginError {
    userName: string;
    constructor(userName: string) {
        super();
        this.userName = userName;
        this.message = `User ${userName} not found.`;
    }
}
export class PasswordNotMatchedError extends AbstractLoginError {
    user: User;
    constructor(user: User) {
        super();
        this.user = user;
        this.message = `User ${user.username} login failed: mismatched password`;
    }
}

class JWTAuthService extends AbstractAuthService {
    constructor(userCrud: AbstractUserCrud) {
        super(userCrud);
    }

    async login(username: string, password: string): Promise<string> {
        const user = await this.userCrud.getUserByUsername(username);
        if (user === undefined) {
            throw new UserNotFoundError(username);
        }
        if (password !== user.password) {
            // TODO: 本来はハッシュ化やソルトなどを用いるべきであるが、今回は勉強用なのでパス
            throw new PasswordNotMatchedError(user);
        }
        const payload: Token = {
            sub: user.username,
            exp: getTokenExp(),
        };
        const token = await sign(payload, SECRET);
        return token;
    }

    async getUser(token: string): Promise<User> {
        const payload = await this.getPayload(token);
        const user = await this.userCrud.getUserByUsername(payload.sub);
        if (user === undefined) {
            throw new UserNotFoundError(payload.sub);
        }
        return user;
    }

    async check(token: string): Promise<boolean> {
        try {
            await this.getPayload(token);
            return true;
        } catch (e) {
            return false;
        }
    }

    private async getPayload(token: string): Promise<Token> {
        return (await verify(token, SECRET)) as Token;
    }
}

export const AuthService = new JWTAuthService(userCrud);
