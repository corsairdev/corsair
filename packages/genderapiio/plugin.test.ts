import {
	GENDERAPIIO_ERROR_CODES,
	genderApiIoEndpointSchemas,
	genderapiio,
} from './index';

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
	plugin: ReturnType<typeof genderapiio>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.capabilities',
	'account.errorCatalog',
	'account.usage',
	'gender.batch',
	'gender.infer',
	'phone.validate',
];

describe('genderapiio plugin definition', () => {
	const plugin = genderapiio();

	it('registers as genderapiio with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('genderapiio');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('adds no account credential fields beyond the key itself', () => {
		expect(plugin.authConfig).toEqual({ api_key: {} });
	});

	it('exposes exactly the catalog operations', () => {
		// A caller writes `api.gender.infer`, `api.account.usage` and so on.
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'account',
			'gender',
			'phone',
		]);
		expect(Object.keys(plugin.endpoints?.gender ?? {}).sort()).toEqual([
			'batch',
			'infer',
		]);
	});

	it('gives every endpoint a description and a read risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
		}
		// Predictions and phone validation use credits but only return data, so
		// they stay read, as metered reads do in the Ahrefs plugin (R8 scope).
		expect(meta['gender.infer']?.riskLevel).toBe('read');
		expect(meta['gender.batch']?.riskLevel).toBe('read');
		expect(meta['phone.validate']?.riskLevel).toBe('read');
		expect(meta['account.usage']?.riskLevel).toBe('read');
		expect(meta['account.capabilities']?.riskLevel).toBe('read');
		expect(meta['account.errorCatalog']?.riskLevel).toBe('read');
	});

	it('declares a schema pair for every endpoint', () => {
		expect(Object.keys(genderApiIoEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
	});
});

describe('genderapiio key builder', () => {
	it('prefers the option key', async () => {
		const plugin = genderapiio({ key: 'option-key' });

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'option-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = genderapiio();

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('returns an empty string when no key is set, so the IP trial is used', async () => {
		const plugin = genderapiio();

		// Unlike most plugins this does not throw: a keyless call is valid, and the
		// API serves an IP-scoped trial for it.
		await expect(buildKey(plugin, keyContext(null))).resolves.toBe('');
	});
});

describe('genderapiio schemas', () => {
	const genderInput = genderApiIoEndpointSchemas['gender.infer'].input;
	const batchInput = genderApiIoEndpointSchemas['gender.batch'].input;
	const phoneInput = genderApiIoEndpointSchemas['phone.validate'].input;

	it('accepts the three documented value types', () => {
		for (const type of ['name', 'email', 'username']) {
			expect(genderInput.safeParse({ type, value: 'x' }).success).toBe(true);
		}
		expect(genderInput.safeParse({ type: 'phone', value: 'x' }).success).toBe(
			false,
		);
	});

	it('rejects a value over 254 characters, which is the documented cap', () => {
		expect(
			genderInput.safeParse({ type: 'email', value: 'a'.repeat(255) }).success,
		).toBe(false);
	});

	it('accepts only the three documented ai_mode values', () => {
		for (const ai_mode of ['off', 'fallback', 'always']) {
			expect(
				genderInput.safeParse({ type: 'name', value: 'x', ai_mode }).success,
			).toBe(true);
		}
		expect(
			genderInput.safeParse({ type: 'name', value: 'x', ai_mode: 'on' })
				.success,
		).toBe(false);
	});

	it('caps a batch at 50 items', () => {
		expect(
			batchInput.safeParse({ items: [{ type: 'name', value: 'x' }] }).success,
		).toBe(true);
		expect(
			batchInput.safeParse({
				items: Array.from({ length: 51 }, () => ({ type: 'name', value: 'x' })),
			}).success,
		).toBe(false);
	});

	it('takes no input on the free routes', () => {
		expect(
			genderApiIoEndpointSchemas['account.usage'].input.safeParse({}).success,
		).toBe(true);
		expect(
			genderApiIoEndpointSchemas['account.capabilities'].input.safeParse({})
				.success,
		).toBe(true);
		expect(
			genderApiIoEndpointSchemas['account.errorCatalog'].input.safeParse({})
				.success,
		).toBe(true);
	});

	it('rejects a phone number shorter than the documented minimum', () => {
		expect(phoneInput.safeParse({ number: '+14155552671' }).success).toBe(true);
		expect(phoneInput.safeParse({ number: '12' }).success).toBe(false);
	});

	it('accepts a null gender, which is an unknown but valid result', () => {
		const parsed = genderApiIoEndpointSchemas['gender.infer'].output.safeParse({
			data: {
				input: { type: 'name', value: 'Xyzzyplugh', country: null },
				name: 'xyzzyplugh',
				gender: null,
				country: null,
				confidence: null,
				confidence_kind: null,
				sample_count: null,
				source: 'none',
				result_status: 'unknown',
				reason: 'not_found',
			},
			meta: { request_id: 'abc' },
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts a batch item that carries an error instead of data', () => {
		const parsed = genderApiIoEndpointSchemas['gender.batch'].output.safeParse({
			data: [
				{
					index: 1,
					error: { code: 'validation_error', message: 'value is too long' },
				},
			],
			meta: { request_id: 'abc' },
		});
		expect(parsed.success).toBe(true);
	});

	it('names the catalog codes the plugin branches on', () => {
		expect(GENDERAPIIO_ERROR_CODES.INSUFFICIENT_CREDITS).toBe(
			'insufficient_credits',
		);
		expect(GENDERAPIIO_ERROR_CODES.AI_UNAVAILABLE).toBe('ai_unavailable');
		expect(GENDERAPIIO_ERROR_CODES.INVALID_API_KEY).toBe('invalid_api_key');
	});
});
