import { enforcePermission, parseDurationMs } from '../core/permissions';
import type { CorsairDatabase } from '../db/kysely/database';

const DEFAULT_MS = 10 * 60 * 1_000;

describe('parseDurationMs', () => {
	it.each([
		['30s', 30_000],
		['10m', 600_000],
		['1h', 3_600_000],
		['2h30m', 9_000_000],
		['1d', 86_400_000],
	])('parses %s', (input, expected) => {
		expect(parseDurationMs(input)).toBe(expected);
	});

	it('keeps 0s as 0', () => {
		expect(parseDurationMs('0s')).toBe(0);
	});

	it.each([
		'1.5h',
		'500ms',
		'',
		'abc',
		'10',
		'5x',
		' 30s',
		'30s ',
		'30s\n',
		'30s\r',
		'1h30',
		`${'9'.repeat(400)}d`,
	])('falls back to the default for %p', (input) => {
		expect(parseDurationMs(input)).toBe(DEFAULT_MS);
	});

	it.each([30, null])(
		'falls back to the default for non-string %p',
		(input) => {
			expect(parseDurationMs(input as unknown as string)).toBe(DEFAULT_MS);
		},
	);
});

describe('enforcePermission zero timeout', () => {
	/**
	 * Permission-store stub. The chain is cast to CorsairDatabase because it
	 * only implements the query methods enforcePermission calls, not the full
	 * Kysely database.
	 */
	function approvalDb() {
		let inserts = 0;
		const chain = {
			selectFrom() {
				return chain;
			},
			selectAll() {
				return chain;
			},
			where() {
				return chain;
			},
			orderBy() {
				return chain;
			},
			limit() {
				return chain;
			},
			executeTakeFirst: async () => undefined,
			insertInto() {
				return chain;
			},
			values() {
				return chain;
			},
			execute: async () => {
				inserts += 1;
			},
		};
		return {
			// Cast: stub covers enforcePermission's query chain, not the full Kysely type.
			db: { db: chain } as unknown as CorsairDatabase,
			inserts: () => inserts,
		};
	}

	const base = {
		pluginId: 'toggl',
		endpointPath: 'timeEntries.create',
		args: { a: 1 },
		mode: 'strict' as const,
		riskLevel: 'write' as const,
	};

	beforeEach(() => {
		jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('does not insert an already-expired approval when the timeout is 0', async () => {
		const store = approvalDb();
		const result = await enforcePermission({
			...base,
			db: store.db,
			timeoutMs: 0,
		});

		expect(result).toEqual({ result: 'blocked', reason: 'timeout' });
		expect(store.inserts()).toBe(0);
	});

	it('still inserts a pending approval for a positive timeout', async () => {
		const store = approvalDb();
		const result = await enforcePermission({
			...base,
			db: store.db,
			timeoutMs: 30_000,
		});

		expect(result.result).toBe('blocked');
		expect(result.reason).toBe('pending');
		expect(store.inserts()).toBe(1);
	});
});
