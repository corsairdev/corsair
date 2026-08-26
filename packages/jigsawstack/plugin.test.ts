import { jest } from '@jest/globals';
import { jigsawstack, jigsawstackEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} auth for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}

	return { AuthMissingError, logEventFromContext: jest.fn() };
});

const EXPECTED_OPERATIONS = [
	'ai.imageGeneration',
	'ai.prediction',
	'ai.sentiment',
	'ai.summary',
	'ai.translate',
	'audio.createVoiceClone',
	'audio.speechToText',
	'audio.textToSpeech',
	'classification.classify',
	'embedding.createV2',
	'promptEngine.create',
	'promptEngine.list',
	'promptEngine.run',
	'validate.nsfw',
	'validate.profanity',
	'validate.spamCheck',
	'validate.spellCheck',
	'vision.detectObjects',
	'vision.vocr',
	'web.htmlToAny',
	'web.scrape',
	'web.search',
	'web.searchSuggestions',
];

function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

function flattenEndpoints(plugin: ReturnType<typeof jigsawstack>): string[] {
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, unknown>
	>;
	return Object.entries(groups)
		.flatMap(([group, ops]) => Object.keys(ops).map((op) => `${group}.${op}`))
		.sort();
}

describe('jigsawstack plugin registration', () => {
	const plugin = jigsawstack();

	it('exposes the 23 operations', () => {
		expect(flattenEndpoints(plugin)).toEqual(EXPECTED_OPERATIONS);
	});

	it('registers every endpoint as a callable function', () => {
		const groups = plugin.endpoints as unknown as Record<
			string,
			Record<string, unknown>
		>;
		for (const ops of Object.values(groups)) {
			for (const [name, fn] of Object.entries(ops)) {
				expect(typeof fn).toBe('function');
				expect(name).not.toHaveLength(0);
			}
		}
	});

	it('has an input and output schema for every endpoint', () => {
		expect(Object.keys(jigsawstackEndpointSchemas).sort()).toEqual(
			EXPECTED_OPERATIONS,
		);

		for (const [name, schemas] of Object.entries(jigsawstackEndpointSchemas)) {
			expect(schemas.input).toBeDefined();
			expect(schemas.output).toBeDefined();
			expect(typeof schemas.input.parse).toBe('function');
			expect(typeof schemas.output.parse).toBe('function');
			expect(name).not.toHaveLength(0);
		}
	});

	it('has metadata with a risk level and description for every endpoint', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string; description: string }
		>;
		expect(Object.keys(meta).sort()).toEqual(EXPECTED_OPERATIONS);

		for (const entry of Object.values(meta)) {
			expect(['read', 'write']).toContain(entry.riskLevel);
			expect(entry.description.length).toBeGreaterThan(0);
		}
	});

	it('declares api_key auth and registers no webhooks', () => {
		expect(plugin.id).toBe('jigsawstack');
		expect(plugin.authConfig).toHaveProperty('api_key');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('resolves a statically configured key without touching the key store', async () => {
		const configured = jigsawstack({ key: 'static-key' });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => {
					throw new Error('key store should not be consulted');
				},
			},
		};

		await expect(keyBuilderOf(configured)(ctx, 'endpoint')).resolves.toBe(
			'static-key',
		);
	});

	it('throws AuthMissingError when no key is configured or stored', async () => {
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		};

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).rejects.toThrow();
	});

	it('parses official summary and nsfw response shapes', () => {
		jigsawstackEndpointSchemas['ai.summary'].output.parse({
			success: true,
			summary: ['one', 'two'],
			_usage: { input_tokens: 1, output_tokens: 2, total_tokens: 3 },
		});
		jigsawstackEndpointSchemas['validate.nsfw'].output.parse({
			success: true,
			nsfw: false,
			nudity: false,
			gore: false,
			nsfw_score: 0.1,
			nudity_score: 0.1,
			gore_score: 0.1,
		});
	});

	it('requires a single summary source and xor url/file for vocr and stt', () => {
		const summary = jigsawstackEndpointSchemas['ai.summary'].input;
		expect(summary.safeParse({ text: 'hello' }).success).toBe(true);
		expect(summary.safeParse({}).success).toBe(false);
		expect(
			summary.safeParse({ text: 'hello', url: 'https://example.com/a.pdf' })
				.success,
		).toBe(false);

		const vocr = jigsawstackEndpointSchemas['vision.vocr'].input;
		expect(vocr.safeParse({ url: 'https://example.com/a.png' }).success).toBe(
			true,
		);
		expect(vocr.safeParse({}).success).toBe(false);
		expect(
			vocr.safeParse({
				url: 'https://example.com/a.png',
				file_store_key: 'k',
			}).success,
		).toBe(false);

		const stt = jigsawstackEndpointSchemas['audio.speechToText'].input;
		expect(stt.safeParse({ url: 'https://example.com/a.wav' }).success).toBe(
			true,
		);
		expect(stt.safeParse({ file_store_key: 'k' }).success).toBe(true);
		expect(stt.safeParse({}).success).toBe(false);
	});

	it('enforces classification dataset and label limits from official docs', () => {
		const classify =
			jigsawstackEndpointSchemas['classification.classify'].input;
		const labels = [
			{ type: 'text' as const, value: 'hotdog' },
			{ type: 'text' as const, value: 'not a hotdog' },
		];
		expect(
			classify.safeParse({
				dataset: [{ type: 'text', value: 'hi' }],
				labels,
			}).success,
		).toBe(true);
		expect(
			classify.safeParse({
				dataset: [
					{ type: 'text', value: 'hi' },
					{ type: 'image', value: 'https://example.com/a.png' },
				],
				labels,
			}).success,
		).toBe(false);
		expect(
			classify.safeParse({
				dataset: [{ type: 'text', value: 'hi' }],
				labels: [{ type: 'text', value: 'only-one' }],
			}).success,
		).toBe(false);
		expect(
			classify.safeParse({
				dataset: [{ type: 'text', value: 'hi' }],
				labels: [
					{ key: 'a', type: 'text', value: 'one' },
					{ key: 'a', type: 'text', value: 'two' },
				],
			}).success,
		).toBe(false);
	});
});
