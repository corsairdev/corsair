import { AuthMissingError } from 'corsair/core';
import { twocaptcha, twocaptchaEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof twocaptcha>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.balance',
	'account.reportCorrect',
	'account.reportIncorrect',
	'tasks.create',
	'tasks.result',
];

describe('twocaptcha plugin definition', () => {
	const plugin = twocaptcha();

	it('registers as twocaptcha with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('twocaptcha');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the five v2 operations', () => {
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
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'account.balance': 'read',
			'account.reportCorrect': 'write',
			'account.reportIncorrect': 'destructive',
			'tasks.create': 'destructive',
			'tasks.result': 'read',
		});
	});

	it('marks task creation destructive, because the account pays for it', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['tasks.create']?.riskLevel).toBe('destructive');
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(twocaptchaEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(twocaptchaEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('names no route twice', () => {
		const nested = Object.values(plugin.endpoints ?? {}).flatMap((group) =>
			Object.values(group),
		);
		expect(new Set(nested).size).toBe(nested.length);
	});
});

describe('twocaptcha key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = twocaptcha({ key: 'inline-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = twocaptcha();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = twocaptcha();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
