import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { Detect } from './endpoints';
import {
	WinstonaiEndpointInputSchemas,
	WinstonaiEndpointOutputSchemas,
} from './endpoints/types';
import { winstonai } from './index';
import { WinstonaiSchema } from './schema';
import { createContext, installFetchHarness } from './test-harness';

const AI_TEXT = `${'Human writers choose specific details. '.repeat(12)}That sentence is long enough for Winston AI.`;
const PLAGIARISM_TEXT = `${'Original research needs citations and a point of view. '.repeat(3)}End.`;

describe('Winstonai schema', () => {
	it('declares a semver version', () => {
		expect(WinstonaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities object map', () => {
		expect(WinstonaiSchema.entities).toEqual({});
		expect(Array.isArray(WinstonaiSchema.entities)).toBe(false);
	});
});

describe('Winstonai plugin contract', () => {
	it('exports a Corsair plugin with api_key auth and the three detect endpoints', () => {
		const plugin = winstonai({ key: 'test-api-key' });
		expect(plugin.id).toBe('winstonai');
		expect(plugin.schema).toBe(WinstonaiSchema);
		expect(Object.keys(plugin.endpoints?.detect ?? {}).sort()).toEqual([
			'aiImage',
			'aiText',
			'plagiarism',
		]);
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual([
			'detect.aiImage',
			'detect.aiText',
			'detect.plagiarism',
		]);
	});

	it('rejects a missing API key from keyBuilder', async () => {
		const plugin = winstonai();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toEqual(expect.any(Function));
		await expect(
			keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => '' },
				} as never,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('Winstonai input schemas', () => {
	it('covers every registered input schema key with a fixture', () => {
		const inputFixtures = {
			detectAiText: { text: AI_TEXT },
			detectPlagiarism: { text: PLAGIARISM_TEXT },
			detectAiImage: { url: 'https://example.com/image.png' },
		};
		expect(Object.keys(inputFixtures).sort()).toEqual(
			Object.keys(WinstonaiEndpointInputSchemas).sort(),
		);
	});

	it('rejects AI text shorter than 300 characters', () => {
		expect(
			WinstonaiEndpointInputSchemas.detectAiText.safeParse({
				text: 'too short',
			}).success,
		).toBe(false);
	});

	it('accepts AI text detection by website without local text', () => {
		expect(
			WinstonaiEndpointInputSchemas.detectAiText.safeParse({
				website: 'https://example.com/article',
			}).success,
		).toBe(true);
	});

	it('rejects plagiarism text shorter than 100 characters', () => {
		expect(
			WinstonaiEndpointInputSchemas.detectPlagiarism.safeParse({
				text: 'too short',
			}).success,
		).toBe(false);
	});

	it('rejects AI image detection without a url', () => {
		expect(
			WinstonaiEndpointInputSchemas.detectAiImage.safeParse({
				image_url: 'https://example.com/image.png',
			}).success,
		).toBe(false);
	});
});

describe('Winstonai endpoints', () => {
	let harness: ReturnType<typeof installFetchHarness>;

	beforeEach(() => {
		harness = installFetchHarness();
	});

	afterEach(() => {
		harness.restore();
	});

	it('posts AI text detection to /v2/ai-content-detection with a Bearer token', async () => {
		harness.queue({
			body: {
				status: 200,
				score: 87,
				sentences: [{ text: 'Hello.', score: 90 }],
				language: 'en',
			},
		});

		const result = await Detect.aiText(createContext(), { text: AI_TEXT });
		const req = harness.requestAt(0);

		expect(req.method).toBe('POST');
		expect(req.url).toBe('https://api.gowinston.ai/v2/ai-content-detection');
		expect(req.headers.authorization).toBe('Bearer test-api-key');
		expect(req.body).toEqual({ text: AI_TEXT });
		expect(result.score).toBe(87);
		expect(
			WinstonaiEndpointOutputSchemas.detectAiText.parse(result).score,
		).toBe(87);
	});

	it('does not send hardcoded language or sentences flags', async () => {
		harness.queue({ body: { score: 50 } });
		await Detect.aiText(createContext(), { text: AI_TEXT });
		expect(harness.requestAt(0).body).toEqual({ text: AI_TEXT });
	});

	it('posts plagiarism detection to /v2/plagiarism', async () => {
		harness.queue({
			body: {
				status: 200,
				result: { score: 12, sourceCounts: 1 },
				sources: [{ url: 'https://example.com', score: 12 }],
			},
		});

		const result = await Detect.plagiarism(createContext(), {
			text: PLAGIARISM_TEXT,
			excluded_sources: ['example.com'],
		});
		const req = harness.requestAt(0);

		expect(req.url).toBe('https://api.gowinston.ai/v2/plagiarism');
		expect(req.body).toEqual({
			text: PLAGIARISM_TEXT,
			excluded_sources: ['example.com'],
		});
		expect(result.result?.score).toBe(12);
		expect(result.sources?.[0]?.url).toBe('https://example.com');
	});

	it('posts image detection to /v2/image-detection with url, not image_url', async () => {
		harness.queue({
			body: {
				score: 20,
				human_probability: 0.2,
				ai_probability: 0.8,
			},
		});

		const result = await Detect.aiImage(createContext(), {
			url: 'https://example.com/cat.png',
			version: 'latest',
		});
		const req = harness.requestAt(0);

		expect(req.url).toBe('https://api.gowinston.ai/v2/image-detection');
		expect(req.body).toEqual({
			url: 'https://example.com/cat.png',
			version: 'latest',
		});
		expect(result.score).toBe(20);
	});

	it('throws AuthMissingError when the key is empty', async () => {
		await expect(
			Detect.aiText(createContext({ key: '   ' }), { text: AI_TEXT }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(harness.requests).toHaveLength(0);
	});

	it('does not retry a 429 at the HTTP layer', async () => {
		harness.queue({
			status: 429,
			body: { error: 'TOO_MANY_REQUESTS' },
			headers: { 'retry-after': '2' },
		});

		await expect(
			Detect.aiText(createContext(), { text: AI_TEXT }),
		).rejects.toBeInstanceOf(ApiError);
		expect(harness.requests).toHaveLength(1);
	});

	it('rejects a response that does not match the output schema', async () => {
		harness.queue({ body: { status: 200 } });
		await expect(
			Detect.aiText(createContext(), { text: AI_TEXT }),
		).rejects.toThrow();
	});
});
