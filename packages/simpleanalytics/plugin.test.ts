import { AuthMissingError } from 'corsair/core';
import type { SimpleanalyticsKeyBuilderContext } from './index';
import { simpleanalytics, simpleanalyticsEndpointSchemas } from './index';

/** The key builder only reads authType and keys. */
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof simpleanalytics>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SimpleanalyticsKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'export.datapoints',
	'stats.get',
	'websites.add',
	'websites.list',
];

describe('simpleanalytics plugin definition', () => {
	const plugin = simpleanalytics();

	it('registers as simpleanalytics with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('simpleanalytics');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the user id as an account-level credential', () => {
		// The Admin API reads a second credential beside the key.
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['user_id'] },
		});
	});

	it('exposes exactly the four catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'stats.get': 'read',
			'export.datapoints': 'read',
			'websites.list': 'read',
			// Adding a website to the account changes state.
			'websites.add': 'write',
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(simpleanalyticsEndpointSchemas).sort()).toEqual(
			operations,
		);
		for (const schemas of Object.values(simpleanalyticsEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = simpleanalytics({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('AUTH_ERROR');
		expect(names).toContain('PERMISSION_ERROR');
	});
});

describe('simpleanalytics key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(
			buildKey(simpleanalytics({ key: 'option-key' }), ctx),
		).resolves.toBe('option-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(simpleanalytics(), keyContext('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(simpleanalytics(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(simpleanalytics(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
