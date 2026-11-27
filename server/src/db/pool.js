// Kết nối PostgreSQL dùng chung cho toàn bộ server
import pg from 'pg';
import { DATABASE_URL } from '../config.js';

export const pool = new pg.Pool({ connectionString: DATABASE_URL, connectionTimeoutMillis: 3000 });

// Kiểm tra kết nối: trả về tên CSDL và phiên bản PostgreSQL
export async function checkDatabase() {
  if (!DATABASE_URL) throw new Error('Chưa đặt DATABASE_URL trong server/.env');
  const { rows } = await pool.query('SELECT current_database() AS name, version() AS version');
  return { name: rows[0].name, version: rows[0].version.split(',')[0] };
}
