import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { inkboxEndpointMeta } from './endpoints/catalog';
import { inkboxOperations } from './endpoints/manifest';
import { errorHandlers } from './error-handlers';
import { inkbox } from './index';

// `unknown` because each case gives the key builder only the context fields it reads.
type KeyBuilder = (
	ctx: unknown,
	source: 'endpoint' | 'webhook',
) => Promise<string>;

function keyBuilderOf(plugin: ReturnType<typeof inkbox>): KeyBuilder {
	return plugin.keyBuilder as unknown as KeyBuilder;
}

// `unknown` because each case sets only the fields the key builder reads.
function keyContext(fields: Record<string, unknown>): unknown {
	return fields;
}

function apiError(status: number): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/api/v1/identities/{agent_handle}' },
		{
			url: 'https://inkbox.ai/api/v1/identities/{agent_handle}',
			ok: false,
			status,
			statusText: 'x',
			body: {},
		},
		`Inkbox ${status}`,
	);
}

describe('inkbox plugin', () => {
	it('registers as inkbox with every operation in the tree and its meta', () => {
		const plugin = inkbox();
		expect(plugin.id).toBe('inkbox');
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			inkboxOperations.map((operation) => operation.id).sort(),
		);
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.endpoints?.mail.messages.send).toEqual(expect.any(Function));
		expect(plugin.endpoints?.slack.messages.send).toEqual(expect.any(Function));
		expect(plugin.endpoints?.billing.lineBundles.buy).toEqual(
			expect.any(Function),
		);
		expect(plugin.endpoints?.account.whoami).toEqual(expect.any(Function));
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual([
			'a2a.taskEvent',
			'imessage.messageEvent',
			'mail.messageEvent',
			'phone.callEnded',
			'phone.textEvent',
			'slack.event',
			'transcriptions.finished',
			'whatsapp.messageEvent',
		]);
		expect(plugin.webhooks?.mail.messageEvent.handler).toEqual(
			expect.any(Function),
		);
	});

	it('uses the key passed in options', async () => {
		const plugin = inkbox({ key: 'ApiKey_option' });
		await expect(
			keyBuilderOf(plugin)(keyContext({ authType: 'api_key' }), 'endpoint'),
		).resolves.toBe('ApiKey_option');
	});

	it('reads the stored key, and asks the tenant to connect when there is none', async () => {
		const plugin = inkbox();
		await expect(
			keyBuilderOf(plugin)(
				keyContext({
					authType: 'api_key',
					keys: { get_api_key: () => Promise.resolve('ApiKey_stored') },
				}),
				'endpoint',
			),
		).resolves.toBe('ApiKey_stored');
		await expect(
			keyBuilderOf(plugin)(
				keyContext({
					authType: 'api_key',
					keys: { get_api_key: () => Promise.resolve(null) },
				}),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('treats an account with no DEK as no stored key', async () => {
		await expect(
			keyBuilderOf(inkbox())(
				keyContext({
					authType: 'api_key',
					keys: {
						get_api_key: () =>
							Promise.reject(new Error('No DEK found for account')),
					},
				}),
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			keyBuilderOf(inkbox())(
				keyContext({
					authType: 'api_key',
					keys: { get_api_key: () => Promise.reject(new Error('db down')) },
				}),
				'endpoint',
			),
		).rejects.toThrow('db down');
	});

	it('builds the webhook key from options, then the stored signing key', async () => {
		await expect(
			keyBuilderOf(inkbox({ webhookSecret: 'whsec_option' }))(
				keyContext({ authType: 'api_key' }),
				'webhook',
			),
		).resolves.toBe('whsec_option');
		await expect(
			keyBuilderOf(inkbox())(
				keyContext({
					authType: 'api_key',
					keys: {
						get_webhook_signature: () => Promise.resolve('whsec_stored'),
					},
				}),
				'webhook',
			),
		).resolves.toBe('whsec_stored');
		// None stored: an empty key, which the handlers refuse with a clear error.
		await expect(
			keyBuilderOf(inkbox())(
				keyContext({
					authType: 'api_key',
					keys: { get_webhook_signature: () => Promise.resolve(null) },
				}),
				'webhook',
			),
		).resolves.toBe('');
	});

	it('keeps DEFAULT last so a caller handler is reached', () => {
		const custom = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const handlers = inkbox({
			errorHandlers: { CUSTOM: custom },
		}).errorHandlers;
		const keys = Object.keys(handlers ?? {});
		expect(keys[keys.length - 1]).toBe('DEFAULT');
		expect(keys).toContain('CUSTOM');
	});
});

describe('error handlers', () => {
	it.each([
		[429, 'RATE_LIMIT_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'AUTH_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[400, 'BAD_REQUEST_ERROR'],
		[409, 'BAD_REQUEST_ERROR'],
		[422, 'BAD_REQUEST_ERROR'],
		[500, 'SERVER_ERROR'],
		[504, 'SERVER_ERROR'],
	])(
		'routes HTTP %i to %s, which does not retry again',
		async (status, name) => {
			const error = apiError(status);
			const matched = Object.entries(errorHandlers).find(([, handler]) =>
				handler.match(error),
			);
			expect(matched?.[0]).toBe(name);
			await expect(matched?.[1].handler()).resolves.toEqual({
				maxRetries: 0,
			});
		},
	);

	it('falls back to the message when an error lost its status', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
		).toBe(true);
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(new Error('Mailbox not found')),
		).toBe(true);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describe('risk levels (PLUGIN_PR_RULES R8)', () => {
	const meta = inkboxEndpointMeta as Record<
		string,
		{ riskLevel: string; irreversible?: boolean; description?: string }
	>;

	it('marks every DELETE destructive, and all but the restorable domain delete irreversible', () => {
		for (const operation of inkboxOperations) {
			if (operation.method !== 'DELETE') continue;
			expect([operation.id, meta[operation.id]?.riskLevel]).toEqual([
				operation.id,
				'destructive',
			]);
			expect([operation.id, meta[operation.id]?.irreversible ?? false]).toEqual(
				[operation.id, operation.id !== 'domains.delete'],
			);
		}
	});

	it('marks every send to a person, an agent or a channel destructive and irreversible', () => {
		for (const id of [
			'mail.messages.send',
			'mail.messages.replyAll',
			'mail.messages.forward',
			'mail.drafts.send',
			'phone.texts.send',
			'phone.calls.place',
			'imessage.messages.send',
			'whatsapp.messages.send',
			'slack.messages.send',
			'a2a.tasks.reply',
		]) {
			expect([id, meta[id]?.riskLevel, meta[id]?.irreversible]).toEqual([
				id,
				'destructive',
				true,
			]);
		}
	});

	it('marks buying, plan changes and numbers destructive', () => {
		for (const id of [
			'billing.changePlan',
			'billing.lineBundles.buy',
			'billing.identityPacks.buy',
			'billing.callingCountries.buy',
			'billing.setVoicePacks',
			'phone.numbers.provision',
			'compliance.campaign.register',
		]) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'destructive']);
		}
		// Releasing a number returns it to the carrier.
		expect(meta['phone.numbers.release']?.irreversible).toBe(true);
	});

	it('marks rotating a key or secret destructive', () => {
		for (const id of [
			'apiKeys.create',
			'identities.signingKey.createOrRotate',
			'inbound.sources.rotate',
			'vault.keys.updatePrimary',
		]) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'destructive']);
		}
	});

	it('marks every GET, and POSTs that only quote or preview, a read', () => {
		for (const operation of inkboxOperations) {
			if (operation.method === 'GET') {
				expect([operation.id, meta[operation.id]?.riskLevel]).toEqual([
					operation.id,
					'read',
				]);
			}
		}
		for (const id of [
			'billing.lineBundles.quote',
			'contacts.previewImport',
			'a2a.invitations.preview',
		]) {
			expect([id, meta[id]?.riskLevel]).toEqual([id, 'read']);
		}
		expect(meta['notes.create']?.riskLevel).toBe('write');
	});

	it('gives every operation a description an agent can act on', () => {
		for (const operation of inkboxOperations) {
			const text = meta[operation.id]?.description ?? '';
			expect([operation.id, text.length > 30]).toEqual([operation.id, true]);
			expect([operation.id, text.includes('\u2014')]).toEqual([
				operation.id,
				false,
			]);
		}
		expect(meta['vault.secrets.create']?.description).toMatch(/encrypt/i);
	});
});
