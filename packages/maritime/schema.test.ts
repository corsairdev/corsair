import {
	maritimeEndpointMeta,
	maritimeEndpointSchemas,
} from './endpoints/catalog';
import {
	MaritimeManifestSchema,
	maritimeManifest,
	maritimeOperations,
} from './endpoints/manifest';
import {
	getMaritimeInputSchema,
	getMaritimeOutputSchema,
	maritimeInputFields,
} from './endpoints/openapi-schema';
import { MARITIME_OPERATION_IDS } from './endpoints/operation-types';

const ids = maritimeOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = maritimeOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('maritime-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			MaritimeManifestSchema.safeParse(maritimeManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 332 operations, one per id and route', () => {
		expect(ids).toHaveLength(332);
		expect(new Set(ids).size).toBe(332);
		expect([...MARITIME_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			maritimeOperations.map(
				(o) => `${o.plane ?? 'api'} ${o.method} ${o.path}`,
			),
		);
		expect(routes.size).toBe(332);
	});

	it('covers the groups of the public API', () => {
		const groups = new Set(ids.map((id) => id.split('.')[0]));
		for (const group of [
			'agents',
			'sandboxes',
			'snapshots',
			'templates',
			'sandboxKeys',
			'sandboxWebhooks',
			'secrets',
			'servers',
			'swarms',
			'computers',
			'apps',
			'appium',
			'endUsers',
			'projects',
			'deployments',
			'domains',
			'network',
			'webhooks',
			'apiKeys',
			'organizations',
			'usage',
			'billing',
			'wallet',
			'plans',
			'account',
			'feedback',
		]) {
			expect(groups.has(group)).toBe(true);
		}
	});

	it('marks the data plane routes and takes the sandbox they go to', () => {
		const data = maritimeOperations.filter((o) => o.plane === 'data');
		expect(data.map((o) => o.id).sort()).toEqual([
			'sandboxes.code.run',
			'sandboxes.commands.get',
			'sandboxes.commands.kill',
			'sandboxes.commands.run',
			'sandboxes.files.delete',
			'sandboxes.files.list',
			'sandboxes.files.read',
			'sandboxes.files.write',
		]);
		for (const o of data) {
			expect(
				maritimeInputFields(o.id).find((f) => f.name === 'sandbox_id')?.in,
			).toBe('sandbox');
		}
	});

	it('fills the virtual machine bodies the spec leaves out', () => {
		const create = operation('sandboxes.create').input.properties as Record<
			string,
			unknown
		>;
		expect(Object.keys(create)).toEqual(
			expect.arrayContaining(['from', 'size', 'memoryMib', 'keepAwake']),
		);
		expect(operation('sandboxWebhooks.create').input.required).toEqual([
			'url',
			'events',
		]);
		expect(operation('usage.sandboxes').input.required).toEqual(['from', 'to']);
	});
});

describe('schemas', () => {
	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(() => getMaritimeInputSchema(id)).not.toThrow();
			expect(() => getMaritimeOutputSchema(id)).not.toThrow();
		}
	});

	it('gives every operation lazy schemas and meta in the catalog', () => {
		expect(Object.keys(maritimeEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(maritimeEndpointMeta).sort()).toEqual([...ids].sort());
		for (const id of ids) {
			const meta =
				maritimeEndpointMeta[id as keyof typeof maritimeEndpointMeta];
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('keeps outputs lenient: unknown fields pass and documented ones may be missing', () => {
		const out = getMaritimeOutputSchema('sandboxes.commands.get').parse({
			id: 'cmd_1',
			newField: 1,
		}) as Record<string, unknown>;
		expect(out.newField).toBe(1);
	});

	it('keeps inputs strict on documented limits', () => {
		const create = getMaritimeInputSchema('sandboxes.create');
		expect(create.safeParse({ vcpu: 17 }).success).toBe(false);
		expect(create.safeParse({ size: 'giant' }).success).toBe(false);
		expect(create.safeParse({ size: 'small', vcpu: 2 }).success).toBe(true);
		expect(
			getMaritimeInputSchema('sandboxes.files.read').safeParse({
				sandbox_id: 'sbx-1',
				path: 'relative',
			}).success,
		).toBe(false);
	});
});

describe('risk levels', () => {
	const risk = (id: string) =>
		maritimeEndpointMeta[id as keyof typeof maritimeEndpointMeta].riskLevel;

	it('marks spending, sending and deleting destructive', () => {
		for (const id of [
			'sandboxes.create',
			'sandboxes.ephemeral.create',
			'sandboxes.commands.run',
			'agents.create',
			'agents.chat.send',
			'swarms.create',
			'servers.rent',
			'computers.create',
			'wallet.topup',
			'billing.plan.change',
			'apiKeys.create',
			'sandboxes.kill',
			'agents.delete',
			'account.delete',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
	});

	it('keeps reads read and plain changes write', () => {
		for (const id of [
			'sandboxes.list',
			'sandboxes.files.read',
			'billing.meteredUsage',
			'usage.sandboxes',
			'agents.logs',
		]) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of ['sandboxes.update', 'agents.env.create', 'secrets.set']) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
	});
});
