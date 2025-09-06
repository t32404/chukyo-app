import pool from '../db/connection.js';
import type { Memory } from '../types.js';
import type { RowDataPacket } from 'mysql2';

interface MemoryRow extends Memory, RowDataPacket {}

export class MemoryService {
  static async createMemory(userId: number, lat: number, lng: number, content: string): Promise<void> {
    await pool.query(
      'INSERT INTO memories (user_id, lat, lng, content) VALUES (?, ?, ?, ?)',
      [userId, lat, lng, content]
    );
  }

  static async getMemoriesByUserId(userId: number): Promise<Memory[]> {
    const [rows] = await pool.query<MemoryRow[]>(
      'SELECT * FROM memories WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
}
