import {
	railwayEndpointMeta,
	railwayEndpointSchemas,
} from './endpoints/catalog';
import {
	RailwayManifestSchema,
	railwayDefinitions,
	railwayManifest,
	railwayOperations,
} from './endpoints/manifest';
import {
	getRailwayInputSchema,
	getRailwayOutputSchema,
} from './endpoints/openapi-schema';
import { RAILWAY_OPERATION_IDS } from './endpoints/operation-types';

const ids = railwayOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = railwayOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('railway-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			RailwayManifestSchema.safeParse(railwayManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 394 operations, one per id and root field', () => {
		expect(ids).toHaveLength(394);
		expect(new Set(ids).size).toBe(394);
		expect([...RAILWAY_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const fields = new Set(
			railwayOperations.map((o) => `${o.kind} ${o.field}`),
		);
		expect(fields.size).toBe(394);
		expect(railwayOperations.filter((o) => o.kind === 'query')).toHaveLength(
			158,
		);
	});

	it('leaves out telemetry, login-session and second-factor fields', () => {
		const fields = railwayOperations.map((o) => o.field);
		for (const left of [
			'cliEventTrack',
			'loginSessionCreate',
			'twoFactorInfoSecret',
			'jobApplicationCreate',
			'adminVolumeInstancesForVolume',
		]) {
			expect(fields).not.toContain(left);
		}
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
					!(inner in railwayDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(railwayManifest);
		expect([...missing]).toEqual([]);
	});

	it('builds one document per field, every argument a variable', () => {
		for (const op of railwayOperations) {
			expect(op.document.startsWith(`${op.kind} `)).toBe(true);
			const args = Object.keys(
				(op.input.properties as Record<string, unknown>) ?? {},
			);
			for (const arg of args) {
				expect(op.document).toContain(`${arg}: $${arg}`);
			}
			// Balanced braces: a selection never closes the operation early.
			let depth = 0;
			for (const char of op.document) {
				if (char === '{') depth++;
				if (char === '}') depth--;
				expect(depth).toBeGreaterThanOrEqual(0);
			}
			expect(depth).toBe(0);
		}
		expect(operation('projects.create').document).toMatch(
			/^mutation ProjectsCreate\(\$input: ProjectCreateInput!\) \{ projectCreate\(input: \$input\) \{ /,
		);
		expect(operation('projects.list').connection).toBe(true);
		expect(operation('projects.list').document).toContain(
			'pageInfo { endCursor hasNextPage hasPreviousPage startCursor }',
		);
		// A connection with its own, smaller PageInfo type (live 11-27).
		expect(operation('environments.history').document).not.toContain(
			'hasPreviousPage',
		);
		// "Not Authorized" for API tokens (live 11-27).
		expect(operation('me.get').document).not.toContain('platformFeatureFlags');
	});
});

describe('catalog', () => {
	it('has meta and schemas for every operation', () => {
		expect(Object.keys(railwayEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(railwayEndpointSchemas).sort()).toEqual([...ids].sort());
		for (const meta of Object.values(railwayEndpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(5);
		}
	});

	it('builds every input and output schema', () => {
		for (const id of ids) {
			expect(getRailwayInputSchema(id)).toBeDefined();
			expect(getRailwayOutputSchema(id)).toBeDefined();
		}
	});

	it('rates reads, writes and destructive calls (R8)', () => {
		const risk = (id: string) =>
			railwayEndpointMeta[id as keyof typeof railwayEndpointMeta].riskLevel;
		for (const id of ['projects.list', 'deployments.logs', 'variables.list']) {
			expect([id, risk(id)]).toEqual([id, 'read']);
		}
		for (const id of [
			'projects.create',
			'projects.update',
			'variables.upsert',
			'serviceDomains.create',
		]) {
			expect([id, risk(id)]).toEqual([id, 'write']);
		}
		for (const id of [
			'projects.delete',
			'services.delete',
			'services.create',
			'serviceInstances.deploy',
			'deployments.redeploy',
			'templates.deploy',
			'apiTokens.create',
			'workspaceMembers.invite',
			'projects.transfer',
			'volumeInstanceBackups.restore',
			'usage.setLimit',
		]) {
			expect([id, risk(id)]).toEqual([id, 'destructive']);
		}
		expect(
			railwayOperations
				.filter((o) => o.kind === 'query')
				.filter((o) => risk(o.id) !== 'read')
				.map((o) => o.id),
		).toEqual([]);
	});

	it('takes the required arguments, refuses unknown ones and closed enums', () => {
		const create = getRailwayInputSchema('projects.create');
		expect(create.safeParse({}).success).toBe(false);
		expect(create.safeParse({ input: { name: 'x' } }).success).toBe(true);
		expect(
			create.safeParse({ input: { name: 'x', notAField: 1 } }).success,
		).toBe(false);
		expect(create.safeParse({ input: {}, extra: 1 }).success).toBe(false);
		const list = getRailwayInputSchema('projects.list');
		expect(list.safeParse({ first: 'ten' }).success).toBe(false);
		expect(list.safeParse({ orderBy: 'NAME_ASC' }).success).toBe(true);
		expect(list.safeParse({ orderBy: 'BOGUS' }).success).toBe(false);
	});

	it('refuses null for a required JSON argument', () => {
		const stage = getRailwayInputSchema('environments.stageChanges');
		expect(stage.safeParse({ environmentId: 'e', input: null }).success).toBe(
			false,
		);
		expect(stage.safeParse({ environmentId: 'e', input: {} }).success).toBe(
			true,
		);
	});

	it('parses responses leniently: unknown fields kept, missing ones fine', () => {
		const out = getRailwayOutputSchema('projects.get').parse({
			id: 'p1',
			name: 'api',
			brandNew: { x: 1 },
		}) as Record<string, unknown>;
		expect(out.brandNew).toEqual({ x: 1 });
		expect(
			getRailwayOutputSchema('projects.get').safeParse({ name: 7 }).success,
		).toBe(false);
	});
});
