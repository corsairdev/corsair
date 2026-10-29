/**
 * Schema invariants: every captured key is accepted, a key-only row parses, and
 * no transactional entity is mirrored.
 */

import {
	BetterstackEndpointInputSchemas,
	BetterstackEndpointOutputSchemas,
	BetterstackListSchema,
	BetterstackSingleSchema,
} from './endpoints/types';
import { OPERATION_TABLE } from './operation-table-fixture';
import { BetterstackSchema } from './schema';

const MIRRORED_PAIRS: ReadonlyArray<readonly [string, string]> = [
	['monitor', 'monitors'],
	['monitor_group', 'monitorGroups'],
	['heartbeat', 'heartbeats'],
	['heartbeat_group', 'heartbeatGroups'],
	['policy', 'policies'],
	['urgency', 'urgencies'],
	['status_page', 'statusPages'],
	['on_call_calendar', 'onCallSchedules'],
];

describe('database schema', () => {
	it('mirrors 8 reference entities', () => {
		const entities = Object.keys(BetterstackSchema.entities);
		expect(entities.length).toBe(8);
		expect(entities.length).toBeGreaterThanOrEqual(4);
	});

	it('mirrors no transactional entity', () => {
		const entities = Object.keys(BetterstackSchema.entities);
		for (const forbidden of [
			'incidents',
			'incidentComments',
			'timeline',
			'statusUpdates',
		]) {
			expect(entities).not.toContain(forbidden);
		}
	});

	it('accepts a row that carries only the primary key', () => {
		expect(MIRRORED_PAIRS.length).toBeGreaterThan(0);
		for (const [, store] of MIRRORED_PAIRS) {
			const entity = (
				BetterstackSchema.entities as Record<
					string,
					{ safeParse: (v: unknown) => { success: boolean } } | undefined
				>
			)[store];
			expect(entity).toBeDefined();
			expect(entity?.safeParse({ id: '1234567' }).success).toBe(true);
		}
	});

	it('rejects a row with no primary key', () => {
		for (const [, store] of MIRRORED_PAIRS) {
			const entity = (
				BetterstackSchema.entities as Record<
					string,
					{ safeParse: (v: unknown) => { success: boolean } } | undefined
				>
			)[store];
			expect(entity).toBeDefined();
			expect(entity?.safeParse({}).success).toBe(false);
		}
	});

	it('accepts null for every non-key field', () => {
		const monitors = BetterstackSchema.entities.monitors;
		const parsed = monitors.safeParse({
			id: '1234567',
			pronounceable_name: null,
			url: null,
			status: null,
			check_frequency: null,
		});
		expect(parsed.success).toBe(true);
	});

	it('coerces timestamps to Date', () => {
		const parsed = BetterstackSchema.entities.monitors.safeParse({
			id: '1234567',
			created_at: '2026-08-16T00:00:00.000Z',
		});
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.created_at).toBeInstanceOf(Date);
		}
	});
});

describe('envelope schemas', () => {
	it('parses the single-resource envelope', () => {
		const parsed = BetterstackSingleSchema.safeParse({
			data: {
				id: '1',
				type: 'monitor',
				attributes: { url: 'https://example.com' },
			},
		});
		expect(parsed.success).toBe(true);
	});

	it('parses the list envelope with full-URL cursors', () => {
		const parsed = BetterstackListSchema.safeParse({
			data: [{ id: '1', type: 'monitor', attributes: {} }],
			pagination: {
				first: 'https://uptime.betterstack.com/api/v2/monitors?page=1',
				last: 'https://uptime.betterstack.com/api/v2/monitors?page=1',
				prev: null,
				next: null,
			},
		});
		expect(parsed.success).toBe(true);
	});

	it('keeps unknown response fields rather than stripping them', () => {
		const parsed = BetterstackSingleSchema.safeParse({
			data: {
				id: '1',
				type: 'monitor',
				attributes: {},
				some_new_field: 'kept',
			},
		});
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect((parsed.data.data as Record<string, unknown>).some_new_field).toBe(
				'kept',
			);
		}
	});
});

describe('endpoint schemas', () => {
	it('declares an input and output schema per operation', () => {
		expect(OPERATION_TABLE.length).toBe(117);
		for (const op of OPERATION_TABLE) {
			const key = op.key.replace(/\.(.)/, (_m, c: string) => c.toUpperCase());
			expect(BetterstackEndpointInputSchemas).toHaveProperty(key);
			expect(BetterstackEndpointOutputSchemas).toHaveProperty(key);
		}
	});

	it('requires the path parameters of a sub-resource operation', () => {
		const schema = BetterstackEndpointInputSchemas.statusUpdatesGet;
		expect(schema.safeParse({}).success).toBe(false);
		expect(
			schema.safeParse({
				status_page_id: 1,
				status_report_id: 2,
				status_update_id: 3,
			}).success,
		).toBe(true);
	});

	it('accepts a path id as either a string or a number', () => {
		const schema = BetterstackEndpointInputSchemas.monitorsGet;
		expect(schema.safeParse({ monitor_id: 1234567 }).success).toBe(true);
		expect(schema.safeParse({ monitor_id: '1234567' }).success).toBe(true);
	});

	it('leaves list filters optional', () => {
		expect(
			BetterstackEndpointInputSchemas.monitorsList.safeParse({}).success,
		).toBe(true);
	});

	it('accepts page controls on every operation returning the list envelope', () => {
		const collections = OPERATION_TABLE.filter(
			(op) =>
				op.api !== 'local' &&
				(op.handler === 'list' ||
					op.handler === 'monitors' ||
					op.handler === 'events' ||
					op.handler === 'statusPages' ||
					op.handler === 'timeline' ||
					op.handler === 'relations' ||
					op.group === 'integrations'),
		);
		expect(collections.length).toBe(37);

		for (const op of collections) {
			const key = op.key.replace(/\.(.)/, (_m, c: string) =>
				c.toUpperCase(),
			) as keyof typeof BetterstackEndpointInputSchemas;
			const schema = BetterstackEndpointInputSchemas[key];
			const path = Object.fromEntries(
				op.pathParams.map((name) => [name, 1] as const),
			);

			expect(
				BetterstackEndpointOutputSchemas[key] === BetterstackListSchema,
			).toBe(true);
			expect(schema.safeParse({ ...path, page: 2, per_page: 50 }).success).toBe(
				true,
			);
			// Omitting them stays valid: pagination is opt-in.
			expect(schema.safeParse(path).success).toBe(true);
		}
	});

	it('rejects unaddressable page controls on every list operation', () => {
		const collections = OPERATION_TABLE.filter(
			(op) =>
				op.api !== 'local' &&
				(op.handler === 'list' ||
					op.handler === 'monitors' ||
					op.handler === 'events' ||
					op.handler === 'statusPages' ||
					op.handler === 'timeline' ||
					op.handler === 'relations' ||
					op.group === 'integrations'),
		);
		expect(collections.length).toBe(37);

		for (const op of collections) {
			const key = op.key.replace(/\.(.)/, (_m, c: string) =>
				c.toUpperCase(),
			) as keyof typeof BetterstackEndpointInputSchemas;
			const schema = BetterstackEndpointInputSchemas[key];
			const path = Object.fromEntries(
				op.pathParams.map((name) => [name, 1] as const),
			);

			expect(schema.safeParse({ ...path, page: 0 }).success).toBe(false);
			expect(schema.safeParse({ ...path, page: -1 }).success).toBe(false);
			expect(schema.safeParse({ ...path, per_page: 1.5 }).success).toBe(false);
		}
	});
});
