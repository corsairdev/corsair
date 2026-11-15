import { AuthMissingError } from 'corsair/core';
import {
	swaggerhub,
	swaggerhubAuthConfig,
	swaggerhubEndpointSchemas,
} from './index';

const OPERATIONS = [
	'apiSettings.getLifecycle',
	'apiSettings.getVisibility',
	'apiSettings.setLifecycle',
	'apiSettings.setVisibility',
	'apis.cloneVersion',
	'apis.compare',
	'apis.delete',
	'apis.deleteVersion',
	'apis.disableNotifications',
	'apis.forkVersion',
	'apis.getCapabilities',
	'apis.getDefaultVersion',
	'apis.getDefinition',
	'apis.getNotifications',
	'apis.list',
	'apis.listVersions',
	'apis.rename',
	'apis.save',
	'apis.setDefaultVersion',
	'apis.setNotifications',
	'comments.create',
	'comments.delete',
	'comments.list',
	'comments.reply',
	'comments.update',
	'domains.delete',
	'domains.deleteVersion',
	'domains.getDefinition',
	'domains.getVersions',
	'domains.list',
	'domains.save',
	'integrations.execute',
	'integrations.list',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.update',
	'specs.list',
	'specs.validate',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.save',
] as const;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: only the keys are walked, so the handler leaf type is never used.
 */
type NestedMap = Record<string, Record<string, unknown>>;

function flatten(tree: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(tree)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

/**
 * unknown: `endpoints` and `endpointMeta` are optionals on `CorsairPlugin`, so
 * the assertions widen them one cast at a time.
 */
function asNested(value: unknown): NestedMap {
	return value as NestedMap;
}

describe('swaggerhub plugin definition', () => {
	const plugin = swaggerhub();
	// unknown: same widening as `asNested`, for the meta map.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as swaggerhub with api_key auth', () => {
		expect(plugin.id).toBe('swaggerhub');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(swaggerhubAuthConfig)).toEqual(['api_key']);
	});

	it('needs no account fields, because one key is the whole credential', () => {
		expect(swaggerhubAuthConfig.api_key).toEqual({});
	});

	it('declares no inbound webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		// A subscription is made through SwaggerHub's own webhook integration,
		// which signs nothing this plugin can verify.
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers exactly the forty-four operations', () => {
		expect(flatten(asNested(plugin.endpoints))).toEqual([...OPERATIONS]);
		expect(OPERATIONS).toHaveLength(44);
	});

	it('gives every operation a risk level', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		for (const entry of Object.values(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('puts the reads on reads', () => {
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();

		expect(reads).toEqual([
			'apiSettings.getLifecycle',
			'apiSettings.getVisibility',
			// A comparison posts a definition but saves nothing, so it is a read.
			'apis.compare',
			'apis.getCapabilities',
			'apis.getDefaultVersion',
			'apis.getDefinition',
			'apis.getNotifications',
			'apis.list',
			'apis.listVersions',
			'comments.list',
			'domains.getDefinition',
			'domains.getVersions',
			'domains.list',
			'integrations.list',
			'projects.get',
			'projects.list',
			'specs.list',
			'specs.validate',
			'templates.get',
			'templates.list',
		]);
	});

	it('marks only the permanent deletes destructive and irreversible', () => {
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual([
			'apis.delete',
			'apis.deleteVersion',
			'comments.delete',
			'domains.delete',
			'domains.deleteVersion',
			'projects.delete',
			'templates.delete',
		]);
	});

	it('keeps disabling notifications a plain write, since nothing is lost', () => {
		expect(meta['apis.disableNotifications']?.riskLevel).toBe('write');
		expect(meta['apis.disableNotifications']?.irreversible).toBeUndefined();
	});

	it('says that renaming breaks the old published URLs', () => {
		expect(meta['apis.rename']?.description).toMatch(/breaks/);
	});

	it('describes every operation in a full sentence', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(20);
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(swaggerhubEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const schemas of Object.values(swaggerhubEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('requires the owner, the api and the version where the path needs them', () => {
		const get = swaggerhubEndpointSchemas['apis.getDefinition'];
		expect(get.input.safeParse({}).success).toBe(false);
		expect(
			get.input.safeParse({ owner: 'a', api: 'b', version: '1.0.0' }).success,
		).toBe(true);
	});

	it('caps the listing limit at the documented hundred', () => {
		const list = swaggerhubEndpointSchemas['specs.list'];
		expect(list.input.safeParse({ limit: 100 }).success).toBe(true);
		expect(list.input.safeParse({ limit: 101 }).success).toBe(false);
	});

	it('accepts only the documented sort and order values', () => {
		const list = swaggerhubEndpointSchemas['specs.list'];
		expect(list.input.safeParse({ sort: 'UPDATED' }).success).toBe(true);
		expect(list.input.safeParse({ sort: 'updated' }).success).toBe(false);
		expect(list.input.safeParse({ order: 'DESC' }).success).toBe(true);
		expect(list.input.safeParse({ order: 'down' }).success).toBe(false);
	});

	it('requires a definition on save and on validate', () => {
		for (const name of ['apis.save', 'specs.validate'] as const) {
			expect(
				swaggerhubEndpointSchemas[name].input.safeParse({ definition: '' })
					.success,
			).toBe(false);
		}
		expect(
			swaggerhubEndpointSchemas['apis.save'].input.safeParse({
				owner: 'a',
				api: 'b',
				definition: 'openapi: 3.0.0',
			}).success,
		).toBe(true);
	});

	it('requires at least one notification scope to set', () => {
		const set = swaggerhubEndpointSchemas['apis.setNotifications'];
		const base = { owner: 'a', api: 'b' };
		expect(set.input.safeParse({ ...base, enabled: [] }).success).toBe(false);
		expect(set.input.safeParse({ ...base, enabled: ['self'] }).success).toBe(
			true,
		);
	});

	it('requires a project name and always allows the collections to be omitted', () => {
		const create = swaggerhubEndpointSchemas['projects.create'];
		expect(create.input.safeParse({ owner: 'a' }).success).toBe(false);
		expect(
			create.input.safeParse({ owner: 'a', name: 'Project' }).success,
		).toBe(true);
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = swaggerhub({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});
});

describe('swaggerhub key builder', () => {
	function ctx(stored: string | null) {
		return {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
			keys: { get_api_key: jest.fn().mockResolvedValue(stored) },
		};
	}

	it('prefers an explicit key without reading the store', async () => {
		const fixture = ctx('stored');

		await expect(
			swaggerhub({ key: 'explicit' }).keyBuilder?.(
				fixture as never,
				'endpoint',
			),
		).resolves.toBe('explicit');
		expect(fixture.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		await expect(
			swaggerhub().keyBuilder?.(ctx('stored') as never, 'endpoint'),
		).resolves.toBe('stored');
	});

	it('throws AuthMissingError when no key is stored', async () => {
		await expect(
			swaggerhub().keyBuilder?.(ctx(null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError, not a TypeError, with no key manager', async () => {
		// A context built without a key manager has no `keys` at all, so reading
		// it would TypeError before the auth error could be raised.
		const bare = {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
		};

		await expect(
			swaggerhub().keyBuilder?.(bare as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses a webhook source', async () => {
		await expect(
			swaggerhub().keyBuilder?.(ctx('stored') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
