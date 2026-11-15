import { kofi, kofiEndpointSchemas, kofiWebhookSchemas } from './index';
import { donation, formBody, TOKEN } from './test-fixtures';

// The key builder reads authType and keys.
function keyContext(token: string | null, apiKey: string | null = null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_verification_token: jest.fn().mockResolvedValue(token),
			get_api_key: jest.fn().mockResolvedValue(apiKey),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof kofi>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, source);
}

const operations = ['webhooks.listEvents'];
// The webhook tree is flat, one entry per payment type, so its keys are the
// paths a caller subscribes to.
const webhookPaths = ['commission', 'donation', 'shopOrder', 'subscription'];

describe('kofi plugin definition', () => {
	const plugin = kofi();

	it('registers as kofi with api_key auth', () => {
		expect(plugin.id).toBe('kofi');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('declares the verification token as an account field', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['verification_token'] },
		});
	});

	it('exposes exactly the catalog operation', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('registers one webhook per payment type', () => {
		expect(Object.keys(plugin.webhooks ?? {}).sort()).toEqual(webhookPaths);
	});

	it('gives the endpoint a description and a read risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		expect(meta['webhooks.listEvents']?.riskLevel).toBe('read');
		expect(meta['webhooks.listEvents']?.description?.length).toBeGreaterThan(
			20,
		);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(kofiEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(kofiEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('has a payload and response schema for every webhook', () => {
		expect(Object.keys(kofiWebhookSchemas).sort()).toEqual(webhookPaths);
		for (const schemas of Object.values(kofiWebhookSchemas)) {
			expect(typeof schemas.payload.safeParse).toBe('function');
			expect(typeof schemas.response.safeParse).toBe('function');
		}
	});

	it('gives each webhook a match function and a handler', () => {
		for (const entry of Object.values(plugin.webhooks ?? {})) {
			expect(typeof entry.match).toBe('function');
			expect(typeof entry.handler).toBe('function');
		}
	});

	it('matches a Ko-fi delivery and nothing else', () => {
		const match = plugin.pluginWebhookMatcher;

		expect(match?.({ headers: {}, body: formBody(donation) })).toBe(true);
		expect(match?.({ headers: {}, body: { event: 'message.sent' } })).toBe(
			false,
		);
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = kofi({
			errorHandlers: {
				UPSTREAM_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('UPSTREAM_ERROR');
		expect(names).toContain('AUTH_ERROR');
	});
});

describe('kofi key builder', () => {
	it('prefers an explicit token option for a webhook', async () => {
		const ctx = keyContext('stored-token');

		await expect(buildKey(kofi({ key: TOKEN }), ctx, 'webhook')).resolves.toBe(
			TOKEN,
		);
		expect(ctx.keys.get_verification_token).not.toHaveBeenCalled();
	});

	it('reads the stored verification token for a webhook', async () => {
		await expect(buildKey(kofi(), keyContext(TOKEN), 'webhook')).resolves.toBe(
			TOKEN,
		);
	});

	it('returns an empty token rather than throwing, so verification fails closed', async () => {
		// A thrown error here would surface as a 500 with no useful message; an
		// empty string makes the comparison fail with the reason it failed.
		await expect(buildKey(kofi(), keyContext(null), 'webhook')).resolves.toBe(
			'',
		);
	});

	it('falls back to the stored api_key, where setup and Hub put the token', async () => {
		await expect(
			buildKey(kofi(), keyContext(null, TOKEN), 'webhook'),
		).resolves.toBe(TOKEN);
		await expect(buildKey(kofi(), keyContext(null, TOKEN))).resolves.toBe(
			TOKEN,
		);
	});

	it('prefers a stored verification_token over the api_key', async () => {
		await expect(
			buildKey(kofi(), keyContext(TOKEN, 'other'), 'webhook'),
		).resolves.toBe(TOKEN);
	});

	it('reads the stored token for the catalog endpoint', async () => {
		await expect(buildKey(kofi(), keyContext(TOKEN))).resolves.toBe(TOKEN);
	});
});
