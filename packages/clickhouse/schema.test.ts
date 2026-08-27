import { ClickhouseSchema } from './schema';
import { ClickhouseQueryResult } from './schema/database';

describe('Clickhouse schema', () => {
	it('declares a semver version', () => {
		expect(ClickhouseSchema.version).toBeDefined();
		expect(ClickhouseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares a non-empty entities map', () => {
		expect(typeof ClickhouseSchema.entities).toBe('object');
		expect(ClickhouseSchema.entities).not.toBeNull();
		const names = Object.keys(ClickhouseSchema.entities);
		expect(names.length).toBeGreaterThan(0);
		for (const entity of Object.values(ClickhouseSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('exposes a queryResult entity that accepts arbitrary row shapes', () => {
		expect(ClickhouseSchema.entities.queryResult).toBeDefined();
		// ClickHouse rows are dynamic — the entity must accept any record shape.
		const parsed = ClickhouseQueryResult.parse({
			name: 'events',
			count: 42,
			nested: { ok: true },
		});
		expect(parsed).toEqual({
			name: 'events',
			count: 42,
			nested: { ok: true },
		});
	});

	it('rejects non-object row shapes on queryResult', () => {
		expect(() => ClickhouseQueryResult.parse('not-an-object')).toThrow();
		expect(() => ClickhouseQueryResult.parse(123)).toThrow();
	});
});
