/**
 * Live smoke tests against a real ServiceNow instance. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/servicenow test:live`.
 *
 * Needs three variables, because an instance host is per-customer:
 *
 *   SERVICENOW_HOST=dev123456.service-now.com
 *   SERVICENOW_USERNAME=admin
 *   SERVICENOW_PASSWORD=...
 *
 * This suite **writes**: it creates one incident and deletes it again. The
 * create is the only way to prove the write path, and the delete cleans up.
 *
 * These tests go through `createCorsair` rather than calling the endpoint
 * functions directly, because the host comes from `ctx.options` and only the
 * bound path builds that context. An earlier version passed a bare `{ key }`
 * and failed on a missing host, which is the mistake this comment prevents.
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ServicenowAPIError } from './client';
import { servicenow } from './index';

const HOST = process.env.SERVICENOW_HOST;
const USERNAME = process.env.SERVICENOW_USERNAME;
const PASSWORD = process.env.SERVICENOW_PASSWORD;

const missing = [
	!HOST && 'SERVICENOW_HOST',
	!USERNAME && 'SERVICENOW_USERNAME',
	!PASSWORD && 'SERVICENOW_PASSWORD',
].filter(Boolean);

// A partial configuration must not read as a pass: say what is missing.
if (missing.length > 0 && missing.length < 3) {
	console.warn(
		`[servicenow live] partially configured, skipping. Missing: ${missing.join(', ')}`,
	);
}

const describeIfKey = HOST && USERNAME && PASSWORD ? describe : describe.skip;

const KEY = JSON.stringify({ username: USERNAME, password: PASSWORD });
const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

async function createClient(key = KEY, host = HOST) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'servicenow', 'default');
	const corsair = createCorsair({
		plugins: [servicenow({ host, key })],
		database: testDb.db,
		kek: KEK,
	});
	return { corsair, testDb };
}

describeIfKey('ServiceNow live smoke', () => {
	it('lists incidents', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.servicenow.api.records.list({
				table: 'incident',
				sysparm_limit: 2,
				sysparm_fields: 'sys_id,number,short_description',
			});

			expect(Array.isArray(result.records)).toBe(true);
			expect(result.records.length).toBeGreaterThan(0);
			// Verified live: every raw value is a string, including numbers.
			expect(typeof result.records[0]!.number).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});

	it('filters with an encoded query and finds the record it created', async () => {
		const { corsair, testDb } = await createClient();
		// Declared outside the try so the remote record is removed even when an
		// assertion fails partway.
		let remoteSysId: string | undefined;
		try {
			const created = await corsair.servicenow.api.records.create({
				table: 'incident',
				fields: { short_description: 'Corsair query probe' },
			});
			remoteSysId = created.sys_id as string;
			const number = created.number as string;

			// Query for that exact record, so an empty result fails the test. The
			// earlier version looped over whatever came back, which passed on zero.
			const result = await corsair.servicenow.api.records.list({
				table: 'incident',
				sysparm_query: `number=${number}`,
				sysparm_fields: 'sys_id,number,short_description',
			});

			expect(result.records).toHaveLength(1);
			expect(result.records[0]!.sys_id).toBe(remoteSysId);
			expect(result.records[0]!.number).toBe(number);
		} finally {
			if (remoteSysId) {
				await corsair.servicenow.api.records
					.delete({ table: 'incident', sys_id: remoteSysId })
					.catch(() => undefined);
			}
			testDb.cleanup();
		}
	});

	it('reads one record by sys_id', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const page = await corsair.servicenow.api.records.list({
				table: 'incident',
				sysparm_limit: 1,
				sysparm_fields: 'sys_id',
			});
			const sysId = page.records[0]!.sys_id as string;

			const record = await corsair.servicenow.api.records.get({
				table: 'incident',
				sys_id: sysId,
				sysparm_fields: 'number,state',
			});

			expect(typeof record.number).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});

	it('creates an incident, then updates and deletes it', async () => {
		const { corsair, testDb } = await createClient();
		// Declared outside the try so the remote record is removed even when an
		// assertion fails partway; otherwise a broken run leaves incidents behind.
		let remoteSysId: string | undefined;
		try {
			const created = await corsair.servicenow.api.records.create({
				table: 'incident',
				fields: {
					short_description: 'Corsair live smoke',
					category: 'software',
				},
			});

			remoteSysId = created.sys_id as string;
			expect(typeof remoteSysId).toBe('string');
			// The create answers the full record with its assigned number.
			expect(typeof created.number).toBe('string');

			const updated = await corsair.servicenow.api.records.update({
				table: 'incident',
				sys_id: remoteSysId,
				fields: { state: '2' },
			});
			expect(updated.state).toBe('2');

			const deleted = await corsair.servicenow.api.records.delete({
				table: 'incident',
				sys_id: remoteSysId,
			});
			expect(deleted.deleted).toBe(true);
			remoteSysId = undefined;

			// The record is really gone: a read now answers 404.
			await expect(
				corsair.servicenow.api.records.get({
					table: 'incident',
					sys_id: deleted.sys_id,
				}),
			).rejects.toThrow(/No Record found/);
		} finally {
			// Best effort: if the delete above never ran, remove the record here so
			// repeated failed runs cannot accumulate test incidents.
			if (remoteSysId) {
				await corsair.servicenow.api.records
					.delete({ table: 'incident', sys_id: remoteSysId })
					.catch(() => undefined);
			}
			testDb.cleanup();
		}
	});

	it('lists tables, and parses a reference column', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// Query a table known to have a non-empty `super_class`. `incident`
			// extends `task`, so its reference is always populated; the earlier
			// version read whatever came first and passed when the field was absent.
			const result = await corsair.servicenow.api.tables.list({
				sysparm_query: 'name=incident',
				sysparm_fields: 'name,label,super_class',
				sysparm_limit: 1,
			});

			expect(result.tables).toHaveLength(1);
			const table = result.tables[0]!;
			expect(table.name).toBe('incident');

			// Verified live: `super_class` is a reference object `{ link, value }`
			// by default, not a bare string, so each of those failures must trip.
			const superClass = table.super_class;
			expect(superClass).toBeDefined();
			expect(superClass).not.toBeNull();
			expect(typeof superClass).toBe('object');
			expect(typeof (superClass as { value?: unknown }).value).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a missing table as a 400, which is what the API does', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// Verified live: this is 400 "Invalid table <name>", not 404.
			try {
				await corsair.servicenow.api.records.list({
					table: 'u_definitely_not_a_table',
				});
				throw new Error('expected a throw');
			} catch (error) {
				expect(error).toBeInstanceOf(ServicenowAPIError);
				expect((error as ServicenowAPIError).status).toBe(400);
				expect((error as ServicenowAPIError).message).toMatch(/Invalid table/i);
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('rejects a bad password with a 401', async () => {
		const wrongKey = JSON.stringify({ username: USERNAME, password: 'wrong' });
		const { corsair, testDb } = await createClient(wrongKey);
		try {
			await expect(
				corsair.servicenow.api.records.list({ table: 'incident' }),
			).rejects.toThrow(/not authenticated/i);
		} finally {
			testDb.cleanup();
		}
	});
});
