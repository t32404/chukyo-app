import pool from '../db/connection.js';
import type { Pin } from '../types.js';
import type { RowDataPacket } from 'mysql2';

interface PinRow extends Pin, RowDataPacket {}

export class PinService {
  static async createPin(userId: number, ido: number, keido: number, content: string): Promise<void> {
    await pool.query(
      'INSERT INTO pins (userid, ido, keido, content) VALUES (?, ?, ?, ?)',
      [userId, ido, keido, content]
    );
  }

  static async getPinsByUserId(userId: number): Promise<Pin[]> {
    const [rows] = await pool.query<PinRow[]>(
      'SELECT * FROM pins WHERE userid = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
}
