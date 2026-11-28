import { AuthMissingError } from 'corsair/core';
import type { NtfyKeyBuilderContext } from './index';
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
	return plugin.keyBuilder?.(
		ctx as unknown as NtfyKeyBuilderContext,
		'endpoint',
	);
}

// 59 operations from the ntfy server routes (v2.38.3).
const EXPECTED_OPERATION_COUNT = 59;
const operations = Object.keys(ntfyEndpointSchemas).sort();

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

	it('exposes the same operations in endpoints, meta and schemas', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(EXPECTED_OPERATION_COUNT);
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
		).toMatchObject({
			'messages.send': ['destructive', true],
			'messages.sendFile': ['destructive', true],
			'messages.poll': ['read', false],
			'messages.update': ['destructive', false],
			'messages.clear': ['write', false],
			'messages.delete': ['destructive', true],
			'account.usage': ['read', false],
			'account.delete': ['destructive', true],
			'tokens.delete': ['destructive', true],
			'phoneNumbers.sendVerification': ['destructive', false],
			'emails.add': ['destructive', false],
			'billing.createSubscription': ['destructive', false],
			'billing.cancelSubscription': ['destructive', true],
			'users.delete': ['destructive', true],
			'users.list': ['read', false],
			'tiers.delete': ['destructive', true],
			'server.health': ['read', false],
			'server.stats': ['read', false],
		});
		// Every op that sends, spends or deletes is destructive. Removing a
		// synced subscription only edits a preference and stays a write.
		for (const name of operations) {
			if (
				name !== 'subscriptions.delete' &&
				/\.(delete|send|sendFile|resetAccess|deleteToken)$/.test(name)
			) {
				expect(meta[name as keyof typeof meta]?.riskLevel).toBe('destructive');
			}
		}
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

	it('sends anonymously with the anonymous option and no key', async () => {
		await expect(
			buildKey(ntfy({ anonymous: true }), keyContext(null)),
		).resolves.toBe('');
		await expect(
			buildKey(ntfy({ anonymous: true }), keyContext('tk_stored')),
		).resolves.toBe('tk_stored');
	});

	it('refuses webhook keys, because ntfy sends no inbound webhooks', async () => {
		await expect(
			ntfy().keyBuilder?.(keyContext('tk_stored') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
