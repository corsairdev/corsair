import { AuthMissingError } from 'corsair/core';
import { ntfy, ntfyEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof ntfy>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.usage',
	'messages.clear',
	'messages.delete',
	'messages.poll',
	'messages.send',
	'messages.update',
	'server.health',
	'server.stats',
];

describe('ntfy plugin definition', () => {
	const plugin = ntfy();

	it('registers as ntfy with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('ntfy');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the eight catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [
					name,
					[entry.riskLevel, entry.irreversible === true],
				]),
			),
		).toEqual({
			'messages.send': ['write', true],
			'messages.poll': ['read', false],
			'messages.update': ['write', false],
			'messages.clear': ['write', false],
			'messages.delete': ['destructive', true],
			'account.usage': ['read', false],
			'server.health': ['read', false],
			'server.stats': ['read', false],
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(ntfyEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(ntfyEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = ntfy({
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

describe('ntfy key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('tk_stored');

		await expect(buildKey(ntfy({ key: 'tk_option' }), ctx)).resolves.toBe(
			'tk_option',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored token', async () => {
		await expect(buildKey(ntfy(), keyContext('tk_stored'))).resolves.toBe(
			'tk_stored',
		);
	});

	it('throws AuthMissingError when no token is stored', async () => {
		await expect(buildKey(ntfy(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys, because ntfy sends no inbound webhooks', async () => {
		await expect(
			ntfy().keyBuilder?.(keyContext('tk_stored') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
