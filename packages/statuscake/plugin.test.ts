import { AuthMissingError } from 'corsair/core';
import { STATUSCAKE_API_BASE } from './client';
import { statuscake, statuscakeEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof statuscake>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'contactGroups.create',
	'contactGroups.delete',
	'contactGroups.get',
	'contactGroups.list',
	'contactGroups.update',
	'heartbeat.create',
	'heartbeat.delete',
	'heartbeat.get',
	'heartbeat.list',
	'heartbeat.update',
	'locations.pagespeed',
	'locations.uptime',
	'maintenanceWindows.create',
	'maintenanceWindows.delete',
	'maintenanceWindows.get',
	'maintenanceWindows.list',
	'maintenanceWindows.update',
	'pagespeed.create',
	'pagespeed.delete',
	'pagespeed.get',
	'pagespeed.history',
	'pagespeed.list',
	'pagespeed.update',
	'ssl.create',
	'ssl.delete',
	'ssl.get',
	'ssl.list',
	'ssl.update',
	'uptime.alerts',
	'uptime.create',
	'uptime.delete',
	'uptime.get',
	'uptime.history',
	'uptime.list',
	'uptime.periods',
	'uptime.update',
];

describe('statuscake plugin definition', () => {
	const plugin = statuscake();

	it('registers as statuscake with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('statuscake');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 36 spec operations across 7 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(7);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const riskOf = (op: string) =>
			op.endsWith('.delete')
				? 'destructive'
				: op.match(/\.(create|update)$/)
					? 'write'
					: 'read';
		for (const op of operations) {
			expect(meta[op as keyof typeof meta]?.riskLevel).toBe(riskOf(op));
		}
	});

	it('marks every delete irreversible and nothing else', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const [name, entry] of Object.entries(meta)) {
			expect(entry.irreversible ?? false).toBe(name.endsWith('.delete'));
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(statuscakeEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(statuscakeEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = statuscake({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('statuscake key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-token');

		await expect(
			buildKey(statuscake({ key: 'option-token' }), ctx),
		).resolves.toBe('option-token');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API token', async () => {
		await expect(
			buildKey(statuscake(), keyContext('stored-token')),
		).resolves.toBe('stored-token');
	});

	it('throws AuthMissingError when no token is stored', async () => {
		await expect(
			buildKey(statuscake(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			statuscake().keyBuilder?.(keyContext('stored-token') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('api surface', () => {
	it('targets the documented v1 host', () => {
		expect(STATUSCAKE_API_BASE).toBe('https://api.statuscake.com/v1');
	});
});
