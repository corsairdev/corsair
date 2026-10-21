import type { CorsairDatabase } from 'corsair/db';
import { sql } from 'corsair/db';
import type { BrowserUseContext } from '..';
import type { BrowserUseBrowser, BrowserUseRun } from '../schema';

const TERMINAL_RUN_STATUSES = new Set(['completed', 'failed', 'cancelled']);
const ENTITY_VERSION = '1.0.0';

// Stored rows are open records. A missing key keeps the previous value.
function mergeDefined<T extends Record<string, unknown>>(
	previous: T | undefined,
	next: Record<string, unknown>,
): T {
	const merged: Record<string, unknown> = { ...(previous ?? {}) };
	for (const [key, value] of Object.entries(next)) {
		if (value !== undefined) merged[key] = value;
	}
	// The caller named T. The merge only copies that row's own keys.
	return merged as T;
}

function mergeRun(
	previous: Record<string, unknown> | undefined,
	next: Record<string, unknown>,
): Record<string, unknown> {
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

function usesPostgres(database: CorsairDatabase): boolean {
	return database.isPg !== false;
}

// SQLite stores JSON text. Postgres may already return an object.
function decodeRow(value: unknown): Record<string, unknown> | undefined {
	const parsed: unknown = typeof value === 'string' ? JSON.parse(value) : value;
	if (!parsed || typeof parsed !== 'object') return undefined;
	// The column is the JSON object this plugin stored.
	return parsed as Record<string, unknown>;
}

async function lockedMerge(
	database: CorsairDatabase,
	accountId: string,
	entityType: string,
	entityId: string,
	patch: Record<string, unknown>,
	merge: (
		previous: Record<string, unknown> | undefined,
		next: Record<string, unknown>,
	) => Record<string, unknown>,
): Promise<void> {
	const postgres = usesPostgres(database);
	for (let attempt = 0; attempt < 8; attempt++) {
		const changed = await database.db
			.connection()
			.execute(async (conn: SqlConn) => {
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
					const read = await sql<{ data: unknown; updated_at: unknown }>`
					SELECT data, updated_at
					FROM ${sql.table('corsair_entities')}
					WHERE account_id = ${accountId}
						AND entity_type = ${entityType}
						AND entity_id = ${entityId}
				`.execute(conn);
					const row = read.rows[0];
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
	ctx: BrowserUseContext,
	browser: BrowserUseBrowser,
): Promise<void> {
	// The entity client exists even when no database is configured.
	const database = ctx.database;
	if (!database) return;
	await enqueueSave(`browser:${browser.id}`, async () => {
		try {
			if (database.db) {
				const accountId = await ctx.$getAccountId();
				await lockedMerge(
					database,
					accountId,
					'browsers',
					browser.id,
					browser,
					mergeDefined,
				);
				return;
			}
			const existing = await ctx.db.browsers.findByEntityId(browser.id);
			await ctx.db.browsers.upsertByEntityId(
				browser.id,
				mergeDefined(existing?.data, browser),
			);
		} catch (error) {
			console.warn('Failed to save Browser Use browser to database:', error);
		}
	});
}

export async function saveRun(
	ctx: BrowserUseContext,
	run: Partial<BrowserUseRun> & { id: string },
): Promise<void> {
	const database = ctx.database;
	if (!database) return;
	await enqueueSave(`run:${run.id}`, async () => {
		try {
			if (database.db) {
				const accountId = await ctx.$getAccountId();
				await lockedMerge(database, accountId, 'runs', run.id, run, mergeRun);
				return;
			}
			const existing = await ctx.db.runs.findByEntityId(run.id);
			await ctx.db.runs.upsertByEntityId(
				run.id,
				// mergeRun returns the stored record. The entity schema checks it on read.
				mergeRun(existing?.data, run) as BrowserUseRun,
			);
		} catch (error) {
			console.warn('Failed to save Browser Use run to database:', error);
		}
	});
}
