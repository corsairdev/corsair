import { AuthMissingError } from 'corsair/core';
import type { TwilioKeyBuilderContext, TwilioPluginOptions } from './index';
import { twilio } from './index';

type KeySource = 'endpoint' | 'webhook';

/** Minimal in-memory credential values backing the stub key manager. */
type KeyStore = {
	apiKey: string | null;
	webhookSignature: string | null;
};

const emptyStore = (): KeyStore => ({ apiKey: null, webhookSignature: null });

/**
 * Stub account key manager. keyBuilder only reads get_api_key and
 * get_webhook_signature; the remaining methods satisfy the typed
 * manager contract so no cast is needed.
 */
function stubKeys(store: KeyStore): TwilioKeyBuilderContext['keys'] {
	const ignoreSetter = async (): Promise<void> => undefined;
	return {
		get_dek: async () => 'test-dek',
		issue_new_dek: async () => 'test-dek',
		get_api_key: async () => store.apiKey,
		set_api_key: ignoreSetter,
		get_webhook_signature: async () => store.webhookSignature,
		set_webhook_signature: ignoreSetter,
		get_accountSid: async () => null,
		set_accountSid: ignoreSetter,
	};
}

/** Minimal keyBuilder context: api_key auth, default tenant, stubbed keys. */
function stubCtx(
	store: KeyStore,
	options: TwilioPluginOptions = {},
): TwilioKeyBuilderContext {
	return {
		authType: 'api_key',
		options,
		keys: stubKeys(store),
		tenantId: 'default',
	};
}

async function resolveKey(
	plugin: ReturnType<typeof twilio>,
	ctx: TwilioKeyBuilderContext,
	source: KeySource,
): Promise<string> {
	const build = plugin.keyBuilder;
	if (!build) {
		throw new Error('twilio plugin must define keyBuilder');
	}
	return build(ctx, source);
}

describe('twilio keyBuilder authentication', () => {
	const plugin = twilio();

	it('throws AuthMissingError for endpoint source when api key is absent', async () => {
		await expect(
			resolveKey(plugin, stubCtx(emptyStore()), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for webhook source when credentials are absent', async () => {
		await expect(
			resolveKey(plugin, stubCtx(emptyStore()), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('never returns an empty key — that would build Accounts//Messages.json', async () => {
		// Regression guard for the original bug: an empty string flowed into
		// endpoint URL building and produced a confusing transport 401.
		const out = await resolveKey(
			plugin,
			stubCtx(emptyStore()),
			'endpoint',
		).then(
			(key) => key,
			() => null,
		);
		expect(out).not.toBe('');
	});

	it('reports twilio / api_key on the thrown error', async () => {
		// The rejection value carries no static type, so it stays unknown
		// here until instanceof narrows it to AuthMissingError below.
		const err: unknown = await resolveKey(
			plugin,
			stubCtx(emptyStore()),
			'endpoint',
		).catch((e: unknown) => e);

		expect(err).toBeInstanceOf(AuthMissingError);
		if (!(err instanceof AuthMissingError)) {
			throw new Error('expected AuthMissingError');
		}
		expect(err.pluginId).toBe('twilio');
		expect(err.authType).toBe('api_key');
	});

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = twilio({ key: 'test-auth-token' });
		const out = await resolveKey(
			withOptionsKey,
			stubCtx(emptyStore()),
			'endpoint',
		);
		expect(out).toBe('test-auth-token');
	});

	it('reads api key from the key manager for endpoint source', async () => {
		const ctx = stubCtx({ apiKey: 'test-api-key', webhookSignature: null });

		await expect(resolveKey(plugin, ctx, 'endpoint')).resolves.toBe(
			'test-api-key',
		);
	});

	it('prefers options.webhookSecret for webhook source', async () => {
		const withSecret = twilio({ webhookSecret: 'test-webhook-secret' });
		const out = await resolveKey(withSecret, stubCtx(emptyStore()), 'webhook');
		expect(out).toBe('test-webhook-secret');
	});

	it('falls back to the stored webhook signature', async () => {
		const ctx = stubCtx({ apiKey: null, webhookSignature: 'test-signature' });

		await expect(resolveKey(plugin, ctx, 'webhook')).resolves.toBe(
			'test-signature',
		);
	});

	it('falls back to the api key for webhook signature verification', async () => {
		const ctx = stubCtx({ apiKey: 'test-api-key', webhookSignature: null });

		await expect(resolveKey(plugin, ctx, 'webhook')).resolves.toBe(
			'test-api-key',
		);
	});
});
