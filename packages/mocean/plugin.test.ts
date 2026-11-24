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

const destructive = [
	'sms.send',
	'templates.delete',
	'verify.request',
	'verify.requestTelegram',
	'verify.resend',
	'voice.dial',
	'voice.hangup',
	'whatsapp.send',
];

const reads = [
	'account.balance',
	'account.pricing',
	'lookup.request',
	'sms.status',
	'templates.get',
	'templates.list',
	'voice.recording',
	'whatsapp.downloadMedia',
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

	const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
		([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
	);

	it('exposes 20 operations across 7 groups', () => {
		expect(nested).toHaveLength(20);
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'account',
			'lookup',
			'sms',
			'templates',
			'verify',
			'voice',
			'whatsapp',
		]);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...nested].sort());
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const byLevel = (level: string) =>
			Object.entries(meta)
				.filter(([, entry]) => entry.riskLevel === level)
				.map(([name]) => name)
				.sort();
		expect(byLevel('destructive')).toEqual(destructive);
		expect(byLevel('read')).toEqual(reads);
		expect(byLevel('write')).toEqual([
			'sms.reportConversion',
			'templates.create',
			'templates.edit',
			'verify.check',
		]);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(moceanEndpointSchemas).sort()).toEqual(
			[...nested].sort(),
		);
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
