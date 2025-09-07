import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db/connection.js';
import type { User, JwtPayload } from '../types.js';
import type { RowDataPacket } from 'mysql2';

interface UserRow extends User, RowDataPacket {}

export class AuthService {
  private static JWT_SECRET = process.env.JWT_SECRET!;

  static async register(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
  }

  static async validateUser(username: string, password: string): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM users WHERE name = ?',
      [username]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    return isValid ? user : null;
  }

  static generateToken(userId: number, username: string): string {
    const payload: JwtPayload = { userId, username };
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '24h' });
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
  }

  static async getUserByUsername(username: string): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM users WHERE name = ?',
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}
