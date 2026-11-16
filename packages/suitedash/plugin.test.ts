import { AuthMissingError } from 'corsair/core';
import type { SuitedashKeyBuilderContext } from './index';
import { suitedash, suitedashEndpointSchemas } from './index';

/** The key builder only reads authType and keys. */
function keyContext(
	apiKey: string | null,
	secretKey: string | null = 'stored-secret',
) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_secret_key: jest.fn().mockResolvedValue(secretKey),
		},
	};
}

const packed = (publicId: string, secretKey: string) =>
	JSON.stringify({ publicId, secretKey });

function buildKey(
	plugin: ReturnType<typeof suitedash>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SuitedashKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'companies.create',
	'companies.get',
	'companies.list',
	'companies.meta',
	'companies.update',
	'contacts.create',
	'contacts.get',
	'contacts.list',
	'contacts.meta',
	'contacts.update',
	'marketing.subscribe',
	'projects.get',
	'projects.list',
	'projects.meta',
	'projects.update',
	'worlds.list',
];

describe('suitedash plugin definition', () => {
	const plugin = suitedash();

	it('registers as suitedash with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('suitedash');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the secret key as a second account credential', () => {
		// SuiteDash has no single-token form: the key is the Public ID and the
		// Secret Key is a separate header.
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['secret_key'] },
		});
	});

	it('exposes exactly the sixteen catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(nested).toHaveLength(16);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks the meta routes and every list as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'companies.meta',
			'contacts.meta',
			'projects.meta',
			'companies.list',
			'contacts.list',
			'projects.list',
			'worlds.list',
		]) {
			expect(meta[name as keyof typeof meta]?.riskLevel).toBe('read');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(suitedashEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(suitedashEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = suitedash({
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
	});
});

describe('suitedash key builder', () => {
	it('prefers explicit key and secret options', async () => {
		const ctx = keyContext('stored-key');

		await expect(
			buildKey(
				suitedash({ key: 'option-key', secretKey: 'option-secret' }),
				ctx,
			),
		).resolves.toBe(packed('option-key', 'option-secret'));
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('packs the stored Public ID and Secret Key', async () => {
		await expect(buildKey(suitedash(), keyContext('stored-key'))).resolves.toBe(
			packed('stored-key', 'stored-secret'),
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(suitedash(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when no secret key is stored, so Corsair offers a connect link', async () => {
		await expect(
			buildKey(suitedash(), keyContext('stored-key', null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(suitedash(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
