import { ClickhouseSchema } from '../schema';
import {
	ClickhouseColumn,
	ClickhouseDatabase,
	ClickhouseQueryResult,
	ClickhouseTable,
} from '../schema/database';

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

	it('parses official system.databases / system.tables / system.columns shapes', () => {
		expect(ClickhouseSchema.entities.database).toBe(ClickhouseDatabase);
		expect(ClickhouseSchema.entities.table).toBe(ClickhouseTable);
		expect(ClickhouseSchema.entities.column).toBe(ClickhouseColumn);

		expect(
			ClickhouseDatabase.parse({ name: 'default', engine: 'Atomic' }),
		).toEqual({ name: 'default', engine: 'Atomic' });

		// Live JSONEachRow from play.clickhouse.com: Nullable(UInt64) is null.
		const table = ClickhouseTable.parse({
			name: 'dashboards',
			engine: 'SystemDashboards',
			totalRows: null,
			totalBytes: null,
		});
		expect(table.totalRows).toBeNull();

		const column = ClickhouseColumn.parse({
			name: 'login',
			type: 'String',
			position: 1,
			comment: '',
			defaultExpression: '',
		});
		expect(column.position).toBe(1);
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
