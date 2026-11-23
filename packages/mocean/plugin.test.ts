import { AuthMissingError } from 'corsair/core';
import { mocean, moceanEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof mocean>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.balance',
	'account.pricing',
	'lookup.request',
	'sms.send',
	'sms.status',
	'verify.check',
	'verify.request',
	'verify.resend',
];

describe('mocean plugin definition', () => {
	const plugin = mocean();

	it('registers as mocean with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('mocean');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the eight catalog operations across four groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(4);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'sms.send': 'destructive',
			'sms.status': 'read',
			'account.balance': 'read',
			'account.pricing': 'read',
			'verify.request': 'destructive',
			'verify.resend': 'destructive',
			'verify.check': 'write',
			'lookup.request': 'read',
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(moceanEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(moceanEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = mocean({
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

describe('mocean key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-token');

		await expect(buildKey(mocean({ key: 'option-token' }), ctx)).resolves.toBe(
			'option-token',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API token', async () => {
		await expect(buildKey(mocean(), keyContext('stored-token'))).resolves.toBe(
			'stored-token',
		);
	});

	it('throws AuthMissingError when no API token is stored', async () => {
		await expect(buildKey(mocean(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			mocean().keyBuilder?.(keyContext('stored-token') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
