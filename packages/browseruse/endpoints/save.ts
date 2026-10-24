import type { EventLoggingContext } from 'corsair/core';
import type { CorsairDatabase } from 'corsair/db';
import { sql } from 'corsair/db';
import { BrowserUseBrowser, BrowserUseRun } from '../schema';

// unknown is necessary: callers ignore the entity-client return. A stricter return is not practical.
type Saved = Promise<unknown>;

export type BrowserUseSaveContext = {
	key: string;
	database?: CorsairDatabase | { db?: undefined };
	$getAccountId: () => Promise<string>;
	db: {
		browsers: {
			findByEntityId: (
				id: string,
			) => Promise<{ data: BrowserUseBrowser } | null | undefined>;
			upsertByEntityId: (id: string, data: BrowserUseBrowser) => Saved;
		};
		runs: {
			findByEntityId: (
				id: string,
			) => Promise<{ data: BrowserUseRun } | null | undefined>;
			upsertByEntityId: (id: string, data: BrowserUseRun) => Saved;
		};
	};
};

// unknown is necessary: stored JSON has no closed field list. A stricter value type is not practical.
type JsonValue = unknown;
type JsonRecord = Record<string, JsonValue>;

const TERMINAL_RUN_STATUSES = new Set(['completed', 'failed', 'cancelled']);
const ENTITY_VERSION = '1.0.0';

// A stored row is open JSON. A named interface would drop provider fields, so a stricter record is not practical.
function mergeDefined(
	previous: JsonRecord | undefined,
	next: JsonRecord,
): JsonRecord {
	const merged: JsonRecord = { ...(previous ?? {}) };
	for (const [key, value] of Object.entries(next)) {
		if (value !== undefined) merged[key] = value;
	}
	return merged;
}

function toRecord(value: object): JsonRecord {
	const record: JsonRecord = {};
	for (const [key, item] of Object.entries(value)) record[key] = item;
	return record;
}

function mergeRun(
	previous: JsonRecord | undefined,
	next: JsonRecord,
): JsonRecord {
	const merged = mergeDefined(previous, next);
	const previousStatus = previous?.status;
	const nextStatus = next.status;
	// A stale poll can still say "running" after a newer poll stored "completed".
	if (
		typeof previousStatus === 'string' &&
		TERMINAL_RUN_STATUSES.has(previousStatus) &&
		typeof nextStatus === 'string' &&
		!TERMINAL_RUN_STATUSES.has(nextStatus)
	) {
		merged.status = previousStatus;
	}
	return merged;
}

type SqlConn = CorsairDatabase['db'];

function isFullDatabase(
	value: BrowserUseSaveContext['database'],
): value is CorsairDatabase {
	return !!value && 'db' in value && value.db != null;
}

export function browserUseLogContext(
	ctx: BrowserUseSaveContext,
): EventLoggingContext {
	return {
		$getAccountId: ctx.$getAccountId,
		database: isFullDatabase(ctx.database) ? ctx.database : undefined,
	};
}

function usesPostgres(database: { isPg?: boolean }): boolean {
	return database.isPg !== false;
}

// unknown is necessary: SQLite returns JSON text and Postgres returns an object. A stricter class is not practical.
function decodeRow(value: unknown): JsonRecord | undefined {
	const parsed: unknown = typeof value === 'string' ? JSON.parse(value) : value;
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		return undefined;
	}
	const record: JsonRecord = {};
	for (const [key, item] of Object.entries(parsed)) record[key] = item;
	return record;
}

// unknown is necessary: drivers throw plain objects or Errors. A stricter error class is not practical.
function isSqliteLock(error: unknown): boolean {
	const message = error instanceof Error ? error.message : '';
	if (/SQLITE_BUSY|database is locked/i.test(message)) return true;
	if (typeof error === 'object' && error !== null && 'code' in error) {
		return Reflect.get(error, 'code') === 'SQLITE_BUSY';
	}
	return false;
}

async function lockedMerge(
	database: { db: CorsairDatabase['db']; isPg?: boolean },
	accountId: string,
	entityType: string,
	entityId: string,
	patch: JsonRecord,
	merge: (previous: JsonRecord | undefined, next: JsonRecord) => JsonRecord,
): Promise<void> {
	const postgres = usesPostgres(database);
	for (let attempt = 0; attempt < 8; attempt++) {
		let changed = 0n;
		try {
			changed = await database.db
				.connection()
				.execute(async (conn: SqlConn) => {
					if (!postgres) await sql`PRAGMA busy_timeout = 5000`.execute(conn);
					if (postgres) await sql`BEGIN`.execute(conn);
					else await sql`BEGIN IMMEDIATE`.execute(conn);
					try {
						if (postgres) {
							await sql`
						SELECT id FROM ${sql.table('corsair_accounts')}
						WHERE id = ${accountId}
						FOR UPDATE
					`.execute(conn);
						}
						// unknown is necessary: data is JSON text or an object, and updated_at is text or a Date. A stricter column type is not practical.
						const read = await sql<{ data: unknown; updated_at: unknown }>`
					SELECT data, updated_at
					FROM ${sql.table('corsair_entities')}
					WHERE account_id = ${accountId}
						AND entity_type = ${entityType}
						AND entity_id = ${entityId}
				`.execute(conn);
						const row = read.rows[0];
						// Test-only. Holds the write lock so another process blocks in BEGIN IMMEDIATE.
						const holdMs = Number(process.env.BROWSERUSE_TEST_HOLD_MS ?? '');
						if (Number.isFinite(holdMs) && holdMs > 0) {
							await new Promise((resolve) => setTimeout(resolve, holdMs));
						}
						const merged = merge(row ? decodeRow(row.data) : undefined, patch);
						const payload = JSON.stringify(merged);
						const data = postgres ? sql`${payload}::jsonb` : sql`${payload}`;
						const now = new Date();
						const result = row
							? await sql`
						UPDATE ${sql.table('corsair_entities')}
						SET data = ${data},
							updated_at = ${now},
							version = ${ENTITY_VERSION}
						WHERE account_id = ${accountId}
							AND entity_type = ${entityType}
							AND entity_id = ${entityId}
							AND updated_at = ${row.updated_at}
					`.execute(conn)
							: await sql`
						INSERT INTO ${sql.table('corsair_entities')} (
							id, created_at, updated_at, account_id, entity_id, entity_type, version, data
						)
						SELECT ${crypto.randomUUID()}, ${now}, ${now}, ${accountId}, ${entityId}, ${entityType}, ${ENTITY_VERSION}, ${data}
						WHERE NOT EXISTS (
							SELECT 1 FROM ${sql.table('corsair_entities')}
							WHERE account_id = ${accountId}
								AND entity_type = ${entityType}
								AND entity_id = ${entityId}
						)
					`.execute(conn);
						await sql`COMMIT`.execute(conn);
						return result.numAffectedRows ?? 0n;
					} catch (error) {
						try {
							await sql`ROLLBACK`.execute(conn);
						} catch {
							// BEGIN may have failed before a transaction existed.
						}
						throw error;
					}
				});
		} catch (error) {
			// Another process holds the SQLite lock. Wait and try the merge again.
			if (!isSqliteLock(error) || attempt === 7) throw error;
			await new Promise((resolve) => setTimeout(resolve, 25 * (attempt + 1)));
			continue;
		}
		if (changed > 0n) return;
	}
	throw new Error(
		`browseruse save for ${entityType} ${entityId} kept changing under a concurrent write`,
	);
}

const saveChains = new Map<string, Promise<void>>();

function enqueueSave(key: string, work: () => Promise<void>): Promise<void> {
	const previous = saveChains.get(key) ?? Promise.resolve();
	const run = previous.then(work, work);
	const settled = run.finally(() => {
		if (saveChains.get(key) === settled) saveChains.delete(key);
	});
	saveChains.set(key, settled);
	return run;
}

export async function saveBrowser(
	ctx: BrowserUseSaveContext,
	browser: BrowserUseBrowser,
): Promise<void> {
	// The entity client exists even when no database is configured.
	const database = ctx.database;
	if (!database) return;
	await enqueueSave(`browser:${browser.id}`, async () => {
		try {
			if (isFullDatabase(database)) {
				const accountId = await ctx.$getAccountId();
				await lockedMerge(
					{ db: database.db, isPg: database.isPg },
					accountId,
					'browsers',
					browser.id,
					toRecord(browser),
					mergeDefined,
				);
				return;
			}
			const existing = await ctx.db.browsers.findByEntityId(browser.id);
			await ctx.db.browsers.upsertByEntityId(
				browser.id,
				BrowserUseBrowser.parse(
					mergeDefined(
						existing?.data ? toRecord(existing.data) : undefined,
						toRecord(browser),
					),
				),
			);
		} catch (error) {
			console.warn('Failed to save Browser Use browser to database:', error);
		}
	});
}

export async function saveRun(
	ctx: BrowserUseSaveContext,
	run: Partial<BrowserUseRun> & { id: string },
): Promise<void> {
	const database = ctx.database;
	if (!database) return;
	await enqueueSave(`run:${run.id}`, async () => {
		try {
			if (isFullDatabase(database)) {
				const accountId = await ctx.$getAccountId();
				await lockedMerge(
					{ db: database.db, isPg: database.isPg },
					accountId,
					'runs',
					run.id,
					toRecord(run),
					mergeRun,
				);
				return;
			}
			const existing = await ctx.db.runs.findByEntityId(run.id);
			await ctx.db.runs.upsertByEntityId(
				run.id,
				BrowserUseRun.parse(
					mergeRun(
						existing?.data ? toRecord(existing.data) : undefined,
						toRecord(run),
					),
				),
			);
		} catch (error) {
			console.warn('Failed to save Browser Use run to database:', error);
		}
	});
}
