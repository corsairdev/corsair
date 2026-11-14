import { AuthMissingError } from 'corsair/core';
import { GENDER_API_ERRNO, genderapi, genderapiEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof genderapi>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.stats',
	'countryOfOrigin.get',
	'email.lookup',
	'fullName.split',
	'lookup.multi',
	'lookup.name',
];

describe('genderapi plugin definition', () => {
	const plugin = genderapi();

	it('registers as genderapi with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('genderapi');
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
		// A caller writes `api.lookup.name`, `api.account.stats` and so on.
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'account',
			'countryOfOrigin',
			'email',
			'fullName',
			'lookup',
		]);
		expect(Object.keys(plugin.endpoints?.lookup ?? {}).sort()).toEqual([
			'multi',
			'name',
		]);
	});

	it('gives every endpoint a description and a read risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(entry.riskLevel).toBe('read');
		}
	});

	it('declares a schema pair for every endpoint', () => {
		expect(Object.keys(genderapiEndpointSchemas).sort()).toEqual(operations);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual(
			operations,
		);
	});
});

describe('genderapi key builder', () => {
	it('prefers the option key', async () => {
		const plugin = genderapi({ key: 'option-key' });

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'option-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = genderapi();

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when there is no key at all', async () => {
		const plugin = genderapi();

		// Gender API has no keyless mode, so this is a real configuration error.
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('throws for a webhook source too, since there are no webhooks', async () => {
		const plugin = genderapi();

		await expect(
			plugin.keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('genderapi schemas', () => {
	const nameInput = genderapiEndpointSchemas['lookup.name'].input;
	const multiInput = genderapiEndpointSchemas['lookup.multi'].input;

	it('accepts a bare name and rejects an empty one', () => {
		expect(nameInput.safeParse({ name: 'Andrea' }).success).toBe(true);
		expect(nameInput.safeParse({ name: '' }).success).toBe(false);
		expect(nameInput.safeParse({}).success).toBe(false);
	});

	it('accepts a two-letter country and rejects a full name', () => {
		expect(nameInput.safeParse({ name: 'Andrea', country: 'IT' }).success).toBe(
			true,
		);
		expect(
			nameInput.safeParse({ name: 'Andrea', country: 'Italy' }).success,
		).toBe(false);
	});

	it('caps a multi lookup at 100 names', () => {
		expect(multiInput.safeParse({ names: ['a', 'b'] }).success).toBe(true);
		expect(multiInput.safeParse({ names: [] }).success).toBe(false);
		expect(
			multiInput.safeParse({
				names: Array.from({ length: 101 }, (_, i) => `n${i}`),
			}).success,
		).toBe(false);
	});

	it('accepts the response a live refusal returned, which is 200 with errno', () => {
		// The output schema is what the endpoint parses before it throws, so the
		// refusal shape has to fit it for the errno to reach the client.
		const parsed = genderapiEndpointSchemas['lookup.name'].output.safeParse({
			name: 'alice',
			errno: 40,
			errmsg: 'invalid or missing key',
			gender: 'unknown',
			samples: 0,
			accuracy: 0,
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts a null last name from strict split', () => {
		const parsed = genderapiEndpointSchemas['fullName.split'].output.safeParse({
			name: 'markus',
			first_name: 'Markus Stefan',
			last_name: null,
			gender: 'male',
			samples: 0,
			accuracy: 0,
			strict: true,
		});
		expect(parsed.success).toBe(true);
	});

	it('names every documented errno', () => {
		expect(GENDER_API_ERRNO).toEqual({
			INVALID_COUNTRY: 10,
			COUNTRY_COUNT_MISMATCH: 11,
			NAME_NOT_SET: 20,
			TOO_MANY_NAMES: 21,
			LIMIT_REACHED: 30,
			INVALID_KEY: 40,
			UNKNOWN_ERROR: 500,
		});
	});
});
