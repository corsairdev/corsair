import type { EndpointJob } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	TeamcampEndpointInputSchemas,
	TeamcampEndpointOutputSchemas,
} from './endpoints/types';
import { teamcamp, teamcampEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof teamcamp>,
	ctx: ReturnType<typeof keyContext>,
) {
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.verify',
	'customers.list',
	'groups.list',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.update',
	'tasks.create',
	'tasks.get',
	'tasks.list',
	'users.list',
];

describe('teamcamp plugin definition', () => {
	const plugin = teamcamp();

	it('registers with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('teamcamp');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the nine working operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('leaves out the four documented operations that do not work', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested).not.toContain('projects.getDetails');
		expect(nested).not.toContain('tasks.update');
		expect(nested).not.toContain('tasks.comment');
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(30);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
		const byRisk = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);
		expect(byRisk).toEqual({
			'account.verify': 'read',
			'customers.list': 'read',
			'groups.list': 'read',
			'projects.create': 'write',
			'projects.delete': 'destructive',
			'projects.get': 'read',
			'projects.list': 'read',
			'projects.update': 'write',
			'tasks.create': 'write',
			'tasks.get': 'read',
			'tasks.list': 'read',
			'users.list': 'read',
		});
	});

	it('declares a schema pair for every endpoint', () => {
		expect(Object.keys(teamcampEndpointSchemas).sort()).toEqual(operations);
		for (const pair of Object.values(teamcampEndpointSchemas)) {
			expect(pair.input).toBeDefined();
			expect(pair.output).toBeDefined();
		}
	});

	it('has no long-running jobs to follow', () => {
		const meta = plugin.endpointMeta as Record<
			string,
			{ job?: EndpointJob } | undefined
		>;
		expect(
			Object.entries(meta).filter(([, entry]) => entry?.job !== undefined),
		).toEqual([]);
	});
});

describe('teamcamp key builder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = teamcamp({ key: 'inline-key' });
		const ctx = keyContext('stored-key');
		expect(await buildKey(plugin, ctx)).toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		expect(await buildKey(teamcamp(), keyContext('stored-key'))).toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither exists', async () => {
		await expect(buildKey(teamcamp(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});

describe('schemas validate their own input', () => {
	it('rejects a missing id where one is required', () => {
		expect(TeamcampEndpointInputSchemas.projectsGet.safeParse({}).success).toBe(
			false,
		);
		expect(
			TeamcampEndpointInputSchemas.projectsGet.safeParse({ projectId: 'p1' })
				.success,
		).toBe(true);
	});

	it('keeps every output schema parseable', () => {
		for (const [name, schema] of Object.entries(
			TeamcampEndpointOutputSchemas,
		)) {
			expect({ name, hasParse: typeof schema.parse === 'function' }).toEqual({
				name,
				hasParse: true,
			});
		}
	});
});
