import { tailscaleEndpointSchemas } from './endpoints/catalog';
import {
	TailscaleManifestSchema,
	tailscaleDefinitions,
	tailscaleManifest,
	tailscaleOperations,
} from './endpoints/manifest';
import {
	getTailscaleInputSchema,
	getTailscaleOutputSchema,
} from './endpoints/openapi-schema';
import { TAILSCALE_OPERATION_IDS } from './endpoints/operation-types';
import {
	TailscaleEndpointInputSchemas,
	TailscaleEndpointOutputSchemas,
} from './endpoints/types';
import { TailscaleSchema } from './schema';

const ids = tailscaleOperations.map((operation) => operation.id);

describe('tailscale-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			TailscaleManifestSchema.safeParse(tailscaleManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has all 93 operations of the spec, one per id, matching the generated types', () => {
		expect(ids).toHaveLength(93);
		expect(new Set(ids).size).toBe(93);
		expect([...TAILSCALE_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			tailscaleOperations.map(
				(operation) => `${operation.method} ${operation.path}`,
			),
		);
		expect(routes.size).toBe(93);
	});

	it('resolves every schema reference', () => {
		const missing = new Set<string>();
		// `unknown` because the walk covers raw JSON Schema documents.
		const visit = (value: unknown) => {
			if (Array.isArray(value)) return value.forEach(visit);
			if (typeof value !== 'object' || value === null) return;
			for (const [key, inner] of Object.entries(value)) {
				if (
					key === '$ref' &&
					typeof inner === 'string' &&
					!(inner in tailscaleDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(tailscaleManifest);
		expect([...missing]).toEqual([]);
	});

	it('declares a response schema for every JSON operation', () => {
		const missing = tailscaleOperations
			.filter(
				(operation) =>
					operation.response !== 'empty' && operation.output === undefined,
			)
			.map((operation) => operation.id);
		expect(missing).toEqual([]);
	});

	it('records the OAuth scopes a route needs where the spec names them', () => {
		const byId = new Map(tailscaleOperations.map((o) => [o.id, o]));
		expect(byId.get('devices.list')?.scopes).toEqual(['devices:core:read']);
		expect(byId.get('policyFile.set')?.scopes).toEqual(['policy_file']);
		expect(byId.get('keys.create')?.scopes).toEqual(
			expect.arrayContaining(['auth_keys', 'oauth_keys']),
		);
	});

	it('makes the tailnet and organization optional path values everywhere', () => {
		for (const operation of tailscaleOperations) {
			const properties = operation.input.properties as Record<
				string,
				Record<string, unknown>
			>;
			const required = (operation.input.required as string[] | undefined) ?? [];
			for (const name of ['tailnet', 'organization']) {
				if (!properties?.[name]) continue;
				expect([operation.id, properties[name]['x-corsair-default']]).toEqual([
					operation.id,
					name,
				]);
				expect(required).not.toContain(name);
			}
		}
	});
});

describe('zod schemas', () => {
	it.each(ids)('%s builds its input and output schemas', (id) => {
		expect(getTailscaleInputSchema(id)).toBeDefined();
		expect(getTailscaleOutputSchema(id)).toBeDefined();
		expect(
			tailscaleEndpointSchemas[id as keyof typeof tailscaleEndpointSchemas]
				.input,
		).toBe(getTailscaleInputSchema(id));
	});

	it('exposes a schema for every id through the exported records', () => {
		expect(Object.keys(TailscaleEndpointInputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(TailscaleEndpointOutputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('takes a policy file as HuJSON text or an object, and requires it', () => {
		const set = getTailscaleInputSchema('policyFile.set');
		expect(
			set.safeParse({ policy: '{ // comment\n "acls": [] }' }).success,
		).toBe(true);
		expect(set.safeParse({ policy: { acls: [] } }).success).toBe(true);
		expect(set.safeParse({ policy: 42 }).success).toBe(false);
		expect(set.safeParse({}).success).toBe(false);
		expect(set.safeParse({ policy: '{}', format: 'yaml' }).success).toBe(false);
	});

	it('takes ACL tests or a draft policy for validation', () => {
		const validate = getTailscaleInputSchema('policyFile.validate');
		expect(
			validate.safeParse({
				tests: [{ src: 'tag:agent', accept: ['tag:mcp:443'] }],
			}).success,
		).toBe(true);
		expect(validate.safeParse({ policy: '{}' }).success).toBe(true);
	});

	it('leaves server-set fields out of request bodies', () => {
		// PostureIntegration's id, status and configUpdated are readOnly.
		const create = getTailscaleInputSchema(
			'postureIntegrations.create',
		) as unknown as { shape: Record<string, unknown> };
		expect(Object.keys(create.shape)).not.toContain('status');
		expect(Object.keys(create.shape)).not.toContain('configUpdated');
		// The output still reads them.
		const output = getTailscaleOutputSchema('postureIntegrations.get');
		expect(
			output.safeParse({ id: 'p1', status: { lastSync: '2026-11-20' } })
				.success,
		).toBe(true);
	});

	it('accepts the null Tailscale sends for an empty invite list', () => {
		expect(
			getTailscaleOutputSchema('deviceInvites.list').safeParse(null).success,
		).toBe(true);
		expect(
			getTailscaleOutputSchema('userInvites.list').safeParse([]).success,
		).toBe(true);
		expect(
			getTailscaleOutputSchema('devices.list').safeParse(null).success,
		).toBe(false);
	});

	it('takes a null in a split DNS update to remove that domain', () => {
		const update = getTailscaleInputSchema('dns.splitDns.update');
		expect(
			update.safeParse({
				domains: { 'corp.example.com': ['10.0.0.53'], 'old.example.com': null },
			}).success,
		).toBe(true);
		expect(update.safeParse({ domains: { a: 'not-a-list' } }).success).toBe(
			false,
		);
	});

	it('refuses unknown keys on routes without a body', () => {
		expect(
			getTailscaleInputSchema('devices.get').safeParse({
				deviceId: 'n1',
				device: 'n1',
			}).success,
		).toBe(false);
	});
});

describe('Tailscale schema', () => {
	it('stores no entities', () => {
		expect(TailscaleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(TailscaleSchema.entities).toEqual({});
	});
});
