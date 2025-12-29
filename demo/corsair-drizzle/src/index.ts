import Database from 'better-sqlite3';
import { corsair, drizzleAdapter, slack } from 'corsair';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const sqlite = new Database('corsair-demo.db');
const db = drizzle(sqlite);

const c = corsair({
	db: drizzleAdapter(db),
	plugins: [slack({ token: process.env.SLACK_BOT_TOKEN ?? 'dev-token' })],
});
