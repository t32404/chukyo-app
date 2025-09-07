import pool from '../db/connection.js';
import type { Pin, MapBounds } from '../types.js';
import type { RowDataPacket } from 'mysql2';

interface PinRow extends Pin, RowDataPacket {}

interface ContentRow extends RowDataPacket {
  content: string;
}

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

  /**
   * 経度を-180〜180の範囲に正規化する
   */
  private static normalizeLongitude(lng: number): number {
    // まず経度を-180〜180の範囲に収める
    let normalized = lng % 360;
    if (normalized > 180) {
      normalized -= 360;
    } else if (normalized < -180) {
      normalized += 360;
    }
    return normalized;
  }

  static async getPinContentsInBounds(bounds: MapBounds): Promise<string[]> {
    // 緯度の条件は常に単純な BETWEEN
    const latCondition = 'ido BETWEEN ? AND ?';
    
    // 経度を正規化
    const normalizedLngMin = this.normalizeLongitude(bounds.lngMin);
    const normalizedLngMax = this.normalizeLongitude(bounds.lngMax);
    
    // 経度の条件を生成（MODを使用して周回を考慮）
    const lngCondition = `
      MOD(keido + 180 - ?, 360) <= MOD(? - ? + 360, 360)
    `;
    
    const params = [
      bounds.latMin, bounds.latMax,
      normalizedLngMin,  // 基準点
      normalizedLngMax,  // 終点
      normalizedLngMin   // 基準点（差分計算用）
    ];

    const [rows] = await pool.query<ContentRow[]>(
      `SELECT content FROM pins 
       WHERE ${latCondition} 
       AND ${lngCondition}
       ORDER BY created_at DESC`,
      params
    );

    return rows.map(row => row.content);
  }
}
