import { AuthMissingError } from 'corsair/core';
import type { TwilioKeyBuilderContext } from './index';
import { twilio } from './index';

type KeyBuilder = (
	ctx: TwilioKeyBuilderContext,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

const keyBuilderOf = (plugin: ReturnType<typeof twilio>): KeyBuilder =>
	plugin.keyBuilder as unknown as KeyBuilder;

/** Empty keystore: every credential accessor resolves to null. */
function emptyKeystoreCtx(): TwilioKeyBuilderContext {
	return {
		authType: 'api_key',
		keys: {
			get_api_key: async (): Promise<string | null> => null,
			get_webhook_signature: async (): Promise<string | null> => null,
		},
	} as unknown as TwilioKeyBuilderContext;
}

describe('twilio keyBuilder authentication', () => {
	const plugin = twilio();

	it('throws AuthMissingError for endpoint source when api key is absent', async () => {
		await expect(
			keyBuilderOf(plugin)(emptyKeystoreCtx(), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for webhook source when credentials are absent', async () => {
		await expect(
			keyBuilderOf(plugin)(emptyKeystoreCtx(), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('never returns an empty key — that would build Accounts//Messages.json', async () => {
		// Regression guard for the original bug: an empty string flowed into
		// endpoint URL building and produced a confusing transport 401.
		const out = await keyBuilderOf(plugin)(emptyKeystoreCtx(), 'endpoint').then(
			(key) => key,
			() => null,
		);
		expect(out).not.toBe('');
	});

	it('reports twilio / api_key on the thrown error', async () => {
		const err = await keyBuilderOf(plugin)(
			emptyKeystoreCtx(),
			'endpoint',
		).catch((e: unknown) => e);

		expect(err).toBeInstanceOf(AuthMissingError);
		expect((err as AuthMissingError).pluginId).toBe('twilio');
		expect((err as AuthMissingError).authType).toBe('api_key');
	});

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = twilio({ key: 'test-auth-token' });
		const out = await keyBuilderOf(withOptionsKey)(
			{ authType: 'api_key' } as unknown as TwilioKeyBuilderContext,
			'endpoint',
		);
		expect(out).toBe('test-auth-token');
	});

	it('reads api key from the key manager for endpoint source', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => 'test-api-key' },
		} as unknown as TwilioKeyBuilderContext;

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).resolves.toBe(
			'test-api-key',
		);
	});

	it('prefers options.webhookSecret for webhook source', async () => {
		const withSecret = twilio({ webhookSecret: 'test-webhook-secret' });
		const out = await keyBuilderOf(withSecret)(emptyKeystoreCtx(), 'webhook');
		expect(out).toBe('test-webhook-secret');
	});

	it('falls back to the stored webhook signature', async () => {
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async (): Promise<string | null> => null,
				get_webhook_signature: async (): Promise<string | null> =>
					'test-signature',
			},
		} as unknown as TwilioKeyBuilderContext;

		await expect(keyBuilderOf(plugin)(ctx, 'webhook')).resolves.toBe(
			'test-signature',
		);
	});

	it('falls back to the api key for webhook signature verification', async () => {
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async (): Promise<string | null> => 'test-api-key',
				get_webhook_signature: async (): Promise<string | null> => null,
			},
		} as unknown as TwilioKeyBuilderContext;

		await expect(keyBuilderOf(plugin)(ctx, 'webhook')).resolves.toBe(
			'test-api-key',
		);
	});
});
