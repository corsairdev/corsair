import {
	ChangeEventSchema,
	ClosestRegionResponseSchema,
	ListenToChangesInputSchema,
	ListenToChangesResponseSchema,
	TursoEndpointInputSchemas,
	TursoEndpointOutputSchemas,
	ValidateApiTokenResponseSchema,
} from './endpoints/types';
import { TursoSchema } from './schema';
import { TursoChangeEvent } from './schema/database';

describe('endpoint schema registry', () => {
	it('exposes an input and output schema for every operation', () => {
		const ops = ['closestRegion', 'validateApiToken', 'listenToChanges'];
		expect(Object.keys(TursoEndpointInputSchemas)).toEqual(ops);
		expect(Object.keys(TursoEndpointOutputSchemas)).toEqual(ops);
	});
});

describe('ClosestRegionResponseSchema', () => {
	it('parses the documented server/client pair', () => {
		expect(
			ClosestRegionResponseSchema.parse({ server: 'lhr', client: 'lhr' }),
		).toMatchObject({ server: 'lhr', client: 'lhr' });
	});

	it('requires both location codes', () => {
		expect(() =>
			ClosestRegionResponseSchema.parse({ server: 'lhr' }),
		).toThrow();
		expect(() => ClosestRegionResponseSchema.parse({})).toThrow();
	});
});

describe('ValidateApiTokenResponseSchema', () => {
	it('accepts -1, meaning the token never expires', () => {
		expect(ValidateApiTokenResponseSchema.parse({ exp: -1 }).exp).toBe(-1);
	});

	it('accepts a unix epoch expiry', () => {
		expect(ValidateApiTokenResponseSchema.parse({ exp: 1789000000 }).exp).toBe(
			1789000000,
		);
	});

	it('rejects a non-integer expiry', () => {
		expect(() => ValidateApiTokenResponseSchema.parse({ exp: 1.5 })).toThrow();
		expect(() => ValidateApiTokenResponseSchema.parse({ exp: '-1' })).toThrow();
		expect(() => ValidateApiTokenResponseSchema.parse({})).toThrow();
	});
});

describe('ListenToChangesInputSchema', () => {
	const base = {
		databaseUrl: 'https://mydb-myorg.turso.io',
		table: 'users',
		action: 'insert',
	};

	it('applies the bounded defaults', () => {
		const parsed = ListenToChangesInputSchema.parse(base);
		expect(parsed.maxEvents).toBe(10);
		expect(parsed.timeoutMs).toBe(15_000);
	});

	it('requires a database-specific URL', () => {
		expect(() =>
			ListenToChangesInputSchema.parse({ ...base, databaseUrl: 'mydb' }),
		).toThrow();
	});

	it('accepts every documented action and rejects others', () => {
		for (const action of ['insert', 'update', 'delete']) {
			expect(ListenToChangesInputSchema.parse({ ...base, action }).action).toBe(
				action,
			);
		}
		expect(() =>
			ListenToChangesInputSchema.parse({ ...base, action: 'truncate' }),
		).toThrow();
	});

	it('bounds maxEvents and timeoutMs so the call always terminates', () => {
		expect(() =>
			ListenToChangesInputSchema.parse({ ...base, maxEvents: 101 }),
		).toThrow();
		expect(() =>
			ListenToChangesInputSchema.parse({ ...base, timeoutMs: 120_001 }),
		).toThrow();
	});
});

describe('ListenToChangesResponseSchema', () => {
	it('discriminates the stream result', () => {
		const parsed = ListenToChangesResponseSchema.parse({
			mode: 'stream',
			table: 'users',
			action: 'insert',
			events: [],
			stoppedBy: 'timeout',
		});
		expect(parsed.mode).toBe('stream');
	});

	it('discriminates the health-check fallback', () => {
		const parsed = ListenToChangesResponseSchema.parse({
			mode: 'health_check',
			table: 'users',
			action: 'insert',
			listenAvailable: false,
			reason: '/beta/listen unavailable (HTTP 403)',
			databaseReachable: true,
		});
		expect(parsed.mode).toBe('health_check');
	});

	it('rejects an unknown mode', () => {
		expect(() =>
			ListenToChangesResponseSchema.parse({ mode: 'poll', table: 'u' }),
		).toThrow();
	});
});

describe('ChangeEventSchema', () => {
	it('keeps provider fields it does not declare', () => {
		const parsed = ChangeEventSchema.parse({
			table: 'users',
			action: 'insert',
			receivedAt: '2026-09-14T00:00:00.000Z',
			data: { id: 1 },
			rowid: 42,
		});
		expect(parsed.rowid).toBe(42);
	});
});

describe('TursoSchema', () => {
	it('declares a versioned changeEvents entity', () => {
		expect(TursoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(TursoSchema.entities.changeEvents).toBe(TursoChangeEvent);
	});

	it('accepts a stored change event', () => {
		const row = TursoChangeEvent.parse({
			databaseUrl: 'https://mydb-myorg.turso.io',
			table: 'users',
			action: 'insert',
			receivedAt: '2026-09-14T00:00:00.000Z',
			data: { id: 1 },
		});
		expect(row.action).toBe('insert');
	});

	it('rejects a row with an unknown action or a bad URL', () => {
		const base = {
			databaseUrl: 'https://mydb-myorg.turso.io',
			table: 'users',
			action: 'insert',
			receivedAt: '2026-09-14T00:00:00.000Z',
		};
		expect(() =>
			TursoChangeEvent.parse({ ...base, action: 'merge' }),
		).toThrow();
		expect(() =>
			TursoChangeEvent.parse({ ...base, databaseUrl: 'x' }),
		).toThrow();
	});
});
