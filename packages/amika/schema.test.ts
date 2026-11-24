import { amikaEndpointSchemas } from './endpoints/catalog';
import {
	AmikaManifestSchema,
	amikaDefinitions,
	amikaManifest,
	amikaOperations,
} from './endpoints/manifest';
import {
	getAmikaInputSchema,
	getAmikaOutputSchema,
} from './endpoints/openapi-schema';
import { AMIKA_OPERATION_IDS } from './endpoints/operation-types';
import {
	AmikaEndpointInputSchemas,
	AmikaEndpointOutputSchemas,
} from './endpoints/types';
import { AmikaSchema } from './schema';

const ids = amikaOperations.map((operation) => operation.id);

describe('amika-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			AmikaManifestSchema.safeParse(amikaManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 98 operations: the 111 spec routes less 6 aliases, 2 SSE streams and 5 secret reveals, one per id, matching the generated types', () => {
		expect(ids).toHaveLength(98);
		expect(new Set(ids).size).toBe(98);
		expect([...AMIKA_OPERATION_IDS].sort()).toEqual([...ids].sort());
		const routes = new Set(
			amikaOperations.map(
				(operation) => `${operation.method} ${operation.path}`,
			),
		);
		expect(routes.size).toBe(98);
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
					!(inner in amikaDefinitions)
				) {
					missing.add(inner);
				}
				visit(inner);
			}
		};
		visit(amikaManifest);
		expect([...missing]).toEqual([]);
	});

	it('declares a response schema for every JSON operation', () => {
		const missing = amikaOperations
			.filter(
				(operation) =>
					operation.response !== 'empty' && operation.output === undefined,
			)
			.map((operation) => operation.id);
		expect(missing).toEqual([]);
	});

	it('leaves out the alias routes, the SSE streams and the secret reveals', () => {
		const routes = new Set(
			amikaOperations.map(
				(operation) => `${operation.method} ${operation.path}`,
			),
		);
		for (const route of [
			'GET /sandbox-snapshots',
			'POST /agent-sessions/stream',
			'GET /agent-sessions/{id}/events',
			'POST /secrets/{id}/reveal',
			'POST /secrets/claude/{id}/reveal',
			'POST /hosts/{id}/reveal',
		]) {
			expect(routes.has(route)).toBe(false);
		}
		expect(routes.has('GET /rig-snapshots')).toBe(true);
		expect(routes.has('GET /rigs:slackMetadata')).toBe(true);
	});

	it('marks the idempotency key as a generated header, never required', () => {
		for (const id of ['commandRuns.create', 'jobs.create', 'jobRuns.start']) {
			const operation = amikaOperations.find((o) => o.id === id);
			const properties = operation?.input.properties as Record<
				string,
				Record<string, unknown>
			>;
			expect(properties.idempotencyKey?.['x-corsair-header']).toBe(
				'Idempotency-Key',
			);
			expect(properties.idempotencyKey?.['x-corsair-generate']).toBe(true);
			expect(
				(operation?.input.required as string[] | undefined) ?? [],
			).not.toContain('idempotencyKey');
		}
	});
});

describe('zod schemas', () => {
	it.each(ids)('%s builds its input and output schemas', (id) => {
		expect(getAmikaInputSchema(id)).toBeDefined();
		expect(getAmikaOutputSchema(id)).toBeDefined();
		expect(
			amikaEndpointSchemas[id as keyof typeof amikaEndpointSchemas].input,
		).toBe(getAmikaInputSchema(id));
	});

	it('exposes a schema for every id through the exported records', () => {
		expect(Object.keys(AmikaEndpointInputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
		expect(Object.keys(AmikaEndpointOutputSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('requires a rig name, and takes env vars as a string map', () => {
		const create = getAmikaInputSchema('rigs.create');
		expect(
			create.safeParse({
				name: 'dev',
				repo_url: 'https://github.com/acme/app',
				env_vars: { NODE_ENV: 'development' },
			}).success,
		).toBe(true);
		expect(create.safeParse({ repo_url: 'x' }).success).toBe(false);
	});

	it('requires a command and a timeout for a command run, and drops the sandbox_* aliases', () => {
		const create = getAmikaInputSchema('commandRuns.create') as unknown as {
			shape: Record<string, unknown>;
			safeParse: (value: unknown) => { success: boolean };
		};
		expect(
			create.safeParse({
				rig_ref: 'dev',
				command: 'echo hi',
				timeout_ms: 60000,
			}).success,
		).toBe(true);
		expect(
			create.safeParse({ rig_ref: 'dev', command: 'echo hi' }).success,
		).toBe(false);
		for (const alias of [
			'sandbox_id',
			'sandbox_name',
			'sandbox_ref',
			'sandbox_create',
			'working_directory',
		]) {
			expect(Object.keys(create.shape)).not.toContain(alias);
		}
		expect(Object.keys(create.shape)).toEqual(
			expect.arrayContaining([
				'rig_id',
				'rig_name',
				'rig_ref',
				'rig_create',
				'cwd',
			]),
		);
	});

	it('takes only the documented agents and models for agentSessions.send', () => {
		const send = getAmikaInputSchema('agentSessions.send');
		expect(
			send.safeParse({
				message: 'run the tests',
				agent: 'claude',
				model: 'opus',
			}).success,
		).toBe(true);
		expect(send.safeParse({ message: 'x', agent: 'gemini' }).success).toBe(
			false,
		);
		expect(send.safeParse({ agent: 'claude' }).success).toBe(false);
	});

	it('reads the documented error-free shapes of list responses', () => {
		expect(getAmikaOutputSchema('rigs.list').safeParse([]).success).toBe(true);
		expect(
			getAmikaOutputSchema('jobs.list').safeParse({
				items: [],
				next_cursor: null,
			}).success,
		).toBe(true);
		expect(
			getAmikaOutputSchema('agentSessions.list').safeParse({
				sessions: [],
				total: 0,
			}).success,
		).toBe(true);
		expect(getAmikaOutputSchema('rigs.list').safeParse(null).success).toBe(
			false,
		);
	});

	it("applies the spec's patterns to what a caller sends", () => {
		const create = getAmikaInputSchema('rigs.create');
		expect(
			create.safeParse({
				name: 'dev',
				disabled_repo_env_var_names: ['APP_MODE'],
			}).success,
		).toBe(true);
		expect(
			create.safeParse({
				name: 'dev',
				disabled_repo_env_var_names: ['bad-name'],
			}).success,
		).toBe(false);
		const host = getAmikaInputSchema('hosts.create');
		expect(
			host.safeParse({ hostname: 'studio-mac', secret: 'x'.repeat(31) })
				.success,
		).toBe(false);
		expect(
			host.safeParse({ hostname: 'studio-mac', secret: 'x'.repeat(32) })
				.success,
		).toBe(true);
	});

	it('honours an exclusive minimum written as a boolean (OpenAPI 3.0 style)', () => {
		const list = getAmikaInputSchema('agentSessions.list');
		expect(list.safeParse({ limit: 0 }).success).toBe(false);
		expect(list.safeParse({ limit: 1 }).success).toBe(true);
	});

	it('refuses extra keys in an object the spec closes, and keeps open ones open', () => {
		const create = getAmikaInputSchema('rigs.create');
		expect(
			create.safeParse({ name: 'dev', amika_api_key: { mode: 'none' } })
				.success,
		).toBe(true);
		expect(
			create.safeParse({
				name: 'dev',
				amika_api_key: { mode: 'new', scope: 'org' },
			}).success,
		).toBe(true);
		expect(
			create.safeParse({
				name: 'dev',
				amika_api_key: { mode: 'none', scope: 'org' },
			}).success,
		).toBe(false);
	});

	it('reads integer response fields as integers', () => {
		const events = getAmikaOutputSchema('commandRuns.listEvents');
		expect(events.safeParse({ items: [], next_sequence: 2 }).success).toBe(
			true,
		);
		expect(events.safeParse({ items: [], next_sequence: 1.5 }).success).toBe(
			false,
		);
	});

	it('drops alias fields at every level, a job step included', () => {
		// `unknown` because the walk covers raw JSON Schema documents.
		const aliases: string[] = [];
		const visit = (value: unknown, path: string) => {
			if (Array.isArray(value)) return value.forEach((v) => visit(v, path));
			if (typeof value !== 'object' || value === null) return;
			for (const [key, inner] of Object.entries(value)) {
				if (
					key === 'description' &&
					typeof inner === 'string' &&
					inner.startsWith('Alias for')
				) {
					aliases.push(path);
				}
				visit(inner, `${path}.${key}`);
			}
		};
		visit(amikaManifest, '');
		expect(aliases).toEqual([]);
		const step = amikaDefinitions.JobStep as {
			properties: Record<string, unknown>;
		};
		expect(Object.keys(step.properties)).not.toContain('working_directory');
		expect(Object.keys(step.properties)).toContain('cwd');
	});

	it('refuses unknown keys on routes without a body', () => {
		expect(
			getAmikaInputSchema('rigs.get').safeParse({
				id: 'dev',
				rig: 'dev',
			}).success,
		).toBe(false);
	});
});

describe('Amika schema', () => {
	it('stores no entities', () => {
		expect(AmikaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(AmikaSchema.entities).toEqual({});
	});
});
