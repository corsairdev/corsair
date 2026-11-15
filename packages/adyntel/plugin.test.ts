import { AuthMissingError } from 'corsair/core';
import { adyntel, adyntelEndpointSchemas } from './index';

const operations = [
	'google.ads',
	'google.shopping',
	'google.shoppingStatus',
	'keywords.paidVsOrganic',
	'linkedin.ads',
	'linkedin.keywordSearch',
	'meta.adSearch',
	'meta.ads',
	'tiktok.adDetails',
	'tiktok.ads',
	'tiktok.keywordSearch',
];

// The key builder reads authType and both account fields.
function keyContext(
	apiKey: string | null,
	email: string | null = 'stored@test.io',
) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_email: jest.fn().mockResolvedValue(email),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof adyntel>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

describe('adyntel plugin definition', () => {
	const plugin = adyntel();

	it('registers as adyntel with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('adyntel');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the account email as an api_key account field', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['email'] },
		});
	});

	it('exposes exactly the eleven catalog operations', () => {
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
		// Adyntel only reads ad libraries; nothing in this plugin changes state.
		for (const entry of Object.values(meta)) {
			expect(entry.riskLevel).toBe('read');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(adyntelEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(adyntelEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = adyntel({
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

describe('adyntel key builder', () => {
	it('joins the API key and the account email', async () => {
		// Adyntel needs both on every call, so the builder hands the endpoint the
		// pair and `call` splits it.
		await expect(
			buildKey(adyntel(), keyContext('stored-key', 'stored@example.com')),
		).resolves.toBe('stored-key\u0000stored@example.com');
	});

	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key', 'stored@example.com');

		await expect(buildKey(adyntel({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key\u0000stored@example.com',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('prefers the email option over the stored one', async () => {
		const ctx = keyContext('stored-key', 'stored@example.com');

		await expect(
			buildKey(adyntel({ email: 'option@example.com' }), ctx),
		).resolves.toBe('stored-key\u0000option@example.com');
		expect(ctx.keys.get_email).not.toHaveBeenCalled();
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(adyntel(), keyContext(null, 'stored@example.com')),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for the email, so connect guidance still applies', async () => {
		// Resolving the email in the builder rather than inside the endpoint is
		// what puts a missing email on the core's connect-link path, the same one
		// a missing key takes.
		const error = await Promise.resolve(
			buildKey(adyntel(), keyContext('stored-key', null)),
		).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect((error as AuthMissingError).authType).toBe('email');
	});

	it('refuses webhook keys, because the plugin receives no webhooks', async () => {
		await expect(
			adyntel().keyBuilder?.(
				keyContext('stored-key', 'stored@example.com') as never,
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
