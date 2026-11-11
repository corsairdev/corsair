import Database from 'better-sqlite3';
import { z } from 'zod';
import { createCorsair } from '../core';
import { getDataFieldTypes } from '../db/kysely/orm';
import { setupCorsair } from '../setup';

// `inspect` lists number, string and boolean filters for enum, literal and
// same-type union fields; search has to apply the same filter type, or a
// numeric `gt`/`equals` on `0 | 1 | 2` falls back to string filters and
// matches every row. The JSON casts behind number and boolean filters are
// Postgres-only, so this checks the type each field resolves to.
describe('search filter type for enum, literal and union fields', () => {
	const types = getDataFieldTypes(
		z.object({
			title: z.string(),
			priority: z.union([z.literal(0), z.literal(1), z.literal(2)]),
			level: z.literal([1, 2, 3]).optional(),
			state: z.enum(['open', 'closed']),
			archived: z.literal([true, false]).nullable(),
			status: z.union([z.literal('a'), z.literal('b'), z.null()]),
			mixed: z.union([z.literal('a'), z.literal(1)]),
			payload: z.object({ id: z.string() }),
		}),
	);

	it('numeric literal unions filter as numbers', () => {
		expect(types.priority).toBe('number');
		expect(types.level).toBe('number');
	});

	it('string enums and string literal unions filter as strings', () => {
		expect(types.state).toBe('string');
		expect(types.status).toBe('string');
		expect(types.title).toBe('string');
	});

	it('boolean literals filter as booleans', () => {
		expect(types.archived).toBe('boolean');
	});

	it('mixed unions and objects get no typed filter', () => {
		expect(types.mixed).toBeUndefined();
		expect(types.payload).toBeUndefined();
	});
});

// SQLite runs the search for real: number, boolean and date filters read the
// JSON with json_extract there (Postgres casts are a syntax error in SQLite).
describe('search on SQLite', () => {
	const plugin = {
		id: 'slack' as const,
		options: { authType: 'api_key' as const },
		schema: {
			version: '1',
			entities: {
				channels: z.object({
					title: z.string(),
					priority: z.union([z.literal(0), z.literal(1), z.literal(2)]),
					count: z.number(),
					state: z.enum(['open', 'closed']),
					archived: z.literal([true, false]).nullable(),
					done: z.boolean(),
					due: z.coerce.date().optional(),
				}),
			},
		},
	};

	let sqlite: InstanceType<typeof Database>;
	let corsair: ReturnType<typeof createCorsair<[typeof plugin]>>;

	beforeEach(async () => {
		sqlite = new Database(':memory:');
		sqlite.exec(`
			CREATE TABLE corsair_integrations (id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL, name TEXT NOT NULL, config TEXT NOT NULL, dek TEXT NULL);
			CREATE TABLE corsair_accounts (id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL, tenant_id TEXT NOT NULL, integration_id TEXT NOT NULL,
				config TEXT NOT NULL, dek TEXT NULL);
			CREATE TABLE corsair_entities (id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL, account_id TEXT NOT NULL, entity_id TEXT NOT NULL,
				entity_type TEXT NOT NULL, version TEXT NOT NULL, data TEXT NOT NULL);
			CREATE TABLE corsair_events (id TEXT PRIMARY KEY, created_at TEXT NOT NULL,
				updated_at TEXT NOT NULL, account_id TEXT NOT NULL, event_type TEXT NOT NULL,
				payload TEXT NOT NULL, status TEXT);
		`);
		corsair = createCorsair({ plugins: [plugin], database: sqlite });
		await setupCorsair(corsair, { silent: true });
		const rows = [
			['a', 0, 5, 'open', false, false, '2026-01-01T00:00:00.000Z'],
			['b', 1, 10, 'closed', true, true, '2026-06-01T00:00:00.000Z'],
			['c', 2, 15, 'open', null, false, '2026-12-01T00:00:00.000Z'],
		] as const;
		for (const [title, priority, count, state, archived, done, due] of rows) {
			await corsair.slack.db.channels.upsertByEntityId(title, {
				title,
				priority,
				count,
				state,
				archived,
				done,
				due: new Date(due),
			});
		}
	});

	afterEach(() => sqlite.close());

	// The cases filter number, boolean, date and string fields with bare values
	// and operator objects ({ gt }, { in }, { after }), so one loose record type
	// covers every call; the ORM under test is what checks each shape.
	const find = async (data: Record<string, unknown>) =>
		(await corsair.slack.db.channels.search({ data }))
			.map((row) => row.data.title)
			.sort();

	it('filters a numeric literal union as a number', async () => {
		expect(await find({ priority: { gt: 0 } })).toEqual(['b', 'c']);
		expect(await find({ priority: { equals: 2 } })).toEqual(['c']);
		expect(await find({ priority: 1 })).toEqual(['b']);
		expect(await find({ priority: { in: [1, 2] } })).toEqual(['b', 'c']);
	});

	it('filters plain numbers, booleans and dates', async () => {
		expect(await find({ count: { gte: 10 } })).toEqual(['b', 'c']);
		expect(await find({ done: true })).toEqual(['b']);
		expect(await find({ archived: { equals: false } })).toEqual(['a']);
		expect(
			await find({ due: { after: new Date('2026-03-01T00:00:00.000Z') } }),
		).toEqual(['b', 'c']);
	});

	it('filters an enum as a string', async () => {
		expect(await find({ state: 'open' })).toEqual(['a', 'c']);
	});
});
