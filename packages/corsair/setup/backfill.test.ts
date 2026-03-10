/**
 * Backfill integration test.
 *
 * Requires the following environment variables:
 *   SLACK_BOT_TOKEN   — Slack bot token with channels:read and users:read scopes
 *   LINEAR_API_KEY    — Linear personal API key
 *   CORSAIR_KEK       — 32-char key-encryption key (any string works for tests)
 *
 * The test is skipped automatically when any of these are absent.
 */

// @ts-expect-error - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import { Kysely, SqliteDialect } from 'kysely';
import { createCorsair } from '../core';
import type { CorsairKyselyDatabase } from '../db/kysely/database';
import { SqliteDatePlugin } from '../db/kysely/sqlite-date-plugin';
import { linear } from '../plugins/linear';
import { slack } from '../plugins/slack';
import { setupCorsair } from './index';

dotenv.config();

function createTestDb() {
	const sqlite = new Database(':memory:');

	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS corsair_integrations (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			name TEXT NOT NULL,
			config TEXT NOT NULL,
			dek TEXT NULL
		);

		CREATE TABLE IF NOT EXISTS corsair_accounts (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			tenant_id TEXT NOT NULL,
			integration_id TEXT NOT NULL,
			config TEXT NOT NULL,
			dek TEXT NULL
		);

		CREATE TABLE IF NOT EXISTS corsair_entities (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL,
			entity_id TEXT NOT NULL,
			entity_type TEXT NOT NULL,
			version TEXT NOT NULL,
			data TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS corsair_events (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL,
			event_type TEXT NOT NULL,
			payload TEXT NOT NULL,
			status TEXT
		);

		CREATE TABLE IF NOT EXISTS corsair_permissions (
			id TEXT PRIMARY KEY,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			account_id TEXT NOT NULL,
			endpoint TEXT NOT NULL,
			status TEXT NOT NULL
		);
	`);

	const db = new Kysely<CorsairKyselyDatabase>({
		dialect: new SqliteDialect({ database: sqlite }),
		plugins: [new SqliteDatePlugin()],
	});

	return {
		db,
		cleanup: () => {
			db.destroy();
			sqlite.close();
		},
	};
}

describe('setupCorsair backfill', () => {
	it('backfills slack channels and users into the DB', async () => {
		const botToken = process.env.SLACK_BOT_TOKEN;
		const kek = process.env.CORSAIR_KEK;
		if (!botToken || !kek) {
			console.log(
				'[backfill.test] Skipping — SLACK_BOT_TOKEN or CORSAIR_KEK not set',
			);
			return;
		}

		const testDb = createTestDb();

		const corsair = createCorsair({
			kek,
			plugins: [slack({ authType: 'api_key' })],
			database: testDb.db,
		});

		// 1. Provision integration + account rows and DEKs
		await setupCorsair(corsair);

		// 2. Store the API key
		await corsair.slack.keys.set_api_key(botToken);

		// 3. Run backfill
		await setupCorsair(corsair, { backfill: true });

		// 4. Verify entities were written
		const entities = await testDb.db
			.selectFrom('corsair_entities')
			.selectAll()
			.execute();

		expect(entities.length).toBeGreaterThan(0);

		const entityTypes = new Set(entities.map((e) => e.entity_type));
		// channels.list stores channels; users.list stores users
		expect(
			[...entityTypes].some((t) => t.includes('channel') || t.includes('user')),
		).toBe(true);

		const summary = [...entityTypes].map((type) => ({
			type,
			count: entities.filter((e) => e.entity_type === type).length,
		}));
		console.table(summary);

		testDb.cleanup();
	});

	it('backfills linear projects and issues into the DB', async () => {
		const apiKey = process.env.LINEAR_API_KEY;
		const kek = process.env.CORSAIR_KEK;
		if (!apiKey || !kek) {
			console.log(
				'[backfill.test] Skipping — LINEAR_API_KEY or CORSAIR_KEK not set',
			);
			return;
		}

		const testDb = createTestDb();

		const corsair = createCorsair({
			kek,
			plugins: [linear({ authType: 'api_key' })],
			database: testDb.db,
		});

		// 1. Provision integration + account rows and DEKs
		await setupCorsair(corsair);

		// 2. Store the API key
		// 2. Store the API key
		await corsair.linear.keys.set_api_key(apiKey);

		// 3. Run backfill
		await setupCorsair(corsair, { backfill: true });

		// 4. Verify entities were written
		const entities = await testDb.db
			.selectFrom('corsair_entities')
			.selectAll()
			.execute();

		expect(entities.length).toBeGreaterThan(0);

		const entityTypes = new Set(entities.map((e) => e.entity_type));
		expect(
			[...entityTypes].some(
				(t) =>
					t.includes('project') || t.includes('issue') || t.includes('team'),
			),
		).toBe(true);

		const summary = [...entityTypes].map((type) => ({
			type,
			count: entities.filter((e) => e.entity_type === type).length,
		}));
		console.table(summary);

		testDb.cleanup();
	});

	it('backfills both slack and linear when both keys are present', async () => {
		const botToken = process.env.SLACK_BOT_TOKEN;
		const apiKey = process.env.LINEAR_API_KEY;
		const kek = process.env.CORSAIR_KEK;
		if (!botToken || !apiKey || !kek) {
			console.log(
				'[backfill.test] Skipping — SLACK_BOT_TOKEN, LINEAR_API_KEY, or CORSAIR_KEK not set',
			);
			return;
		}

		const testDb = createTestDb();

		const corsair = createCorsair({
			kek,
			plugins: [
				slack({ authType: 'api_key' }),
				linear({ authType: 'api_key' }),
			],
			database: testDb.db,
		});

		await setupCorsair(corsair);

		await corsair.slack.keys.set_api_key(botToken);
		await corsair.linear.keys.set_api_key(apiKey);

		await setupCorsair(corsair, { backfill: true });

		const entities = await testDb.db
			.selectFrom('corsair_entities')
			.selectAll()
			.execute();

		expect(entities.length).toBeGreaterThan(0);

		const entityTypes = new Set(entities.map((e) => e.entity_type));
		const summary = [...entityTypes].map((type) => ({
			type,
			count: entities.filter((e) => e.entity_type === type).length,
		}));
		console.table(summary);

		testDb.cleanup();
	});
});
