import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema';

// Load env as early as possible (import order matters with ESM).
config({ path: '.env' });

export const sqlite: DatabaseType = new Database('./corsair.db');

export const db = drizzle(sqlite, { schema });

export type DB = typeof db;
