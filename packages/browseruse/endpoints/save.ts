import type { EventLoggingContext } from 'corsair/core';
import type { CorsairDatabase } from 'corsair/db';
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

// Saves for one id run one after another, so a status poll that overlaps
// `runs.get` reads the row the get just wrote instead of an older copy.
// Every write goes through the entity client, which seals rows when the
// app turns on encryptDataAtRest.
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
	if (!ctx.database) return;
	await enqueueSave(`browser:${browser.id}`, async () => {
		try {
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
	if (!ctx.database) return;
	await enqueueSave(`run:${run.id}`, async () => {
		try {
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
