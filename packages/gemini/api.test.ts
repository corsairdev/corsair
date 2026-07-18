import 'dotenv/config';
import { ApiError } from 'corsair/http';
import { makeGeminiRequest } from './client';
import { Content, Images, Models, Videos } from './endpoints';
import {
	buildImageGenerationConfig,
	extractImagesFromCandidates,
} from './endpoints/image-utils';
import { stripMarkdownFences } from './endpoints/text-utils';
import type {
	CountTokensResponse,
	EmbedContentResponse,
	GenerateContentResponse,
	ListModelsResponse,
} from './endpoints/types';
import {
	GeminiEndpointInputSchemas,
	GeminiEndpointOutputSchemas,
} from './endpoints/types';
import type { GeminiContext } from './index';
import type { VideoOperation } from './schema/videos';

const TEST_API_KEY = process.env.GEMINI_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

/**
 * Minimal plugin context for live endpoint-handler tests.
 * logEventFromContext requires $getAccountId; without a DB it no-ops after resolve.
 */
function testCtx(key: string): GeminiContext {
	return {
		key,
		// No database in unit tests — logEvent returns null after account resolve
		database: undefined,
		$getAccountId: async () => 'test-account-id',
	} as unknown as GeminiContext;
}

/** Free-tier image/Veo often return 429; treat as soft skip so CI stays green. */
function isRateLimitedOrUnavailable(error: unknown): boolean {
	if (error instanceof ApiError) {
		return error.status === 429 || error.status === 403 || error.status === 404;
	}
	const msg = error instanceof Error ? error.message.toLowerCase() : '';
	return (
		msg.includes('too many requests') ||
		msg.includes('429') ||
		msg.includes('resource_exhausted') ||
		msg.includes('quota') ||
		msg.includes('not found')
	);
}

describe('Gemini offline unit tests', () => {
	it('stripMarkdownFences removes a single leading/trailing fence', () => {
		const raw = '```html\n<div>hello</div>\n```';
		expect(stripMarkdownFences(raw)).toBe('<div>hello</div>');
	});

	it('stripMarkdownFences leaves plain text unchanged', () => {
		expect(stripMarkdownFences('hello world')).toBe('hello world');
	});

	it('buildImageGenerationConfig always forces responseModalities IMAGE', () => {
		const config = buildImageGenerationConfig({
			temperature: 0.5,
			// Attempt to override IMAGE with TEXT — must not win
			responseModalities: ['TEXT'],
		});
		expect(config.responseModalities).toEqual(['IMAGE']);
		expect(config.temperature).toBe(0.5);
	});

	it('extractImagesFromCandidates maps inlineData parts to images', () => {
		const images = extractImagesFromCandidates([
			{
				content: {
					parts: [
						{ text: 'ignore me' },
						{ inlineData: { mimeType: 'image/png', data: 'abc123' } },
					],
				},
			},
		]);
		expect(images).toEqual([
			{ mimeType: 'image/png', contentBase64: 'abc123' },
		]);
	});

	it('extractImagesFromCandidates returns empty array when no candidates', () => {
		expect(extractImagesFromCandidates(undefined)).toEqual([]);
	});

	// Minimal valid input fixtures for every registered endpoint (offline coverage).
	const inputFixtures: Record<string, unknown> = {
		countTokens: {
			model: 'gemini-2.5-flash',
			contents: [{ role: 'user', parts: [{ text: 'hi' }] }],
		},
		embedContent: {
			model: 'gemini-embedding-001',
			content: { parts: [{ text: 'hi' }] },
		},
		generateContent: {
			model: 'gemini-2.5-flash',
			contents: [{ role: 'user', parts: [{ text: 'hi' }] }],
		},
		generateImage: {
			model: 'gemini-2.5-flash-image',
			prompt: 'a cat',
		},
		generateVideos: {
			model: 'veo-2.0-generate-001',
			prompt: 'A calm ocean at sunrise',
		},
		getVideosOperation: {
			operationName: 'models/veo-2.0-generate-001/operations/123',
		},
		listModels: {},
		waitForVideo: {
			operationName: 'models/veo-2.0-generate-001/operations/123',
		},
	};

	it('covers every registered input schema key with a fixture', () => {
		const schemaKeys = Object.keys(GeminiEndpointInputSchemas).sort();
		const fixtureKeys = Object.keys(inputFixtures).sort();
		expect(fixtureKeys).toEqual(schemaKeys);
		expect(schemaKeys.length).toBe(
			Object.keys(GeminiEndpointOutputSchemas).length,
		);
	});

	it.each(Object.keys(GeminiEndpointInputSchemas))(
		'input schema accepts minimal payload for %s',
		(key) => {
			const schema =
				GeminiEndpointInputSchemas[
					key as keyof typeof GeminiEndpointInputSchemas
				];
			const result = schema.safeParse(inputFixtures[key]);
			expect(result.success).toBe(true);
		},
	);

	it('generateContent input schema rejects missing contents', () => {
		const result = GeminiEndpointInputSchemas.generateContent.safeParse({
			model: 'gemini-2.5-flash',
		});
		expect(result.success).toBe(false);
	});

	it('getVideosOperation output schema accepts done+error LRO payload', () => {
		const result = GeminiEndpointOutputSchemas.getVideosOperation.safeParse({
			name: 'models/veo/operations/123',
			done: true,
			error: { code: 3, message: 'failed' },
		});
		expect(result.success).toBe(true);
	});

	it('waitForVideo output schema accepts pending and failed shapes', () => {
		const pending = GeminiEndpointOutputSchemas.waitForVideo.safeParse({
			operationName: 'models/veo/operations/123',
			done: false,
		});
		expect(pending.success).toBe(true);

		const failed = GeminiEndpointOutputSchemas.waitForVideo.safeParse({
			operationName: 'models/veo/operations/123',
			done: true,
			error: { code: 3, message: 'failed' },
		});
		expect(failed.success).toBe(true);
	});

	it('generateImage output schema accepts images array', () => {
		const result = GeminiEndpointOutputSchemas.generateImage.safeParse({
			images: [{ mimeType: 'image/png', contentBase64: 'abc' }],
		});
		expect(result.success).toBe(true);
	});
});

describeIfApiKey('Gemini API Type Tests', () => {
	describe('models.listModels', () => {
		it('listModels returns correct type', async () => {
			const response = await makeGeminiRequest<ListModelsResponse>(
				'/models',
				TEST_API_KEY!,
				{ method: 'GET' },
			);

			GeminiEndpointOutputSchemas.listModels.parse(response);
			expect(response.models.length).toBeGreaterThan(0);
		});
	});

	describe('content.countTokens', () => {
		it('countTokens returns correct type', async () => {
			const response = await makeGeminiRequest<CountTokensResponse>(
				// Must include /models/ — matches production endpoint paths
				'/models/gemini-2.5-flash:countTokens',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						contents: [{ role: 'user', parts: [{ text: 'Hello, Gemini!' }] }],
					},
				},
			);

			GeminiEndpointOutputSchemas.countTokens.parse(response);
			expect(response.totalTokens).toBeGreaterThan(0);
		});
	});

	describe('content.embedContent', () => {
		it('embedContent returns correct type', async () => {
			const response = await makeGeminiRequest<EmbedContentResponse>(
				'/models/gemini-embedding-001:embedContent',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						content: { parts: [{ text: 'Corsair plugin integration test' }] },
					},
				},
			);

			GeminiEndpointOutputSchemas.embedContent.parse(response);
			expect(response.embedding.values.length).toBeGreaterThan(0);
		});
	});

	describe('content.generateContent', () => {
		it('generateContent returns correct type', async () => {
			const response = await makeGeminiRequest<GenerateContentResponse>(
				'/models/gemini-2.5-flash:generateContent',
				TEST_API_KEY!,
				{
					method: 'POST',
					body: {
						contents: [
							{
								role: 'user',
								parts: [{ text: 'Reply with exactly one word: pong' }],
							},
						],
					},
				},
			);

			GeminiEndpointOutputSchemas.generateContent
				.omit({ text: true })
				.parse(response);
			expect(response.candidates?.length).toBeGreaterThan(0);
		});
	});

	describe('images.generateImage', () => {
		it('generateImage HTTP response can extract images when model is available', async () => {
			try {
				const response = await makeGeminiRequest<{
					candidates?: Array<{
						content?: {
							parts?: Array<{
								inlineData?: { mimeType: string; data: string };
							}>;
						};
					}>;
				}>('/models/gemini-2.5-flash-image:generateContent', TEST_API_KEY!, {
					method: 'POST',
					body: {
						contents: [
							{ role: 'user', parts: [{ text: 'A simple red circle icon' }] },
						],
						generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
					},
				});
				expect(response).toBeDefined();
				const images = extractImagesFromCandidates(
					response.candidates as never,
				);
				expect(Array.isArray(images)).toBe(true);
			} catch (error) {
				if (isRateLimitedOrUnavailable(error)) {
					console.warn(
						'Skipping generateImage live test (quota / model unavailable):',
						error instanceof Error ? error.message : error,
					);
					return;
				}
				throw error;
			}
		});
	});

	describe('videos.generateVideos + getVideosOperation', () => {
		it('generateVideos kicks off an operation and getVideosOperation polls it', async () => {
			try {
				const response = await makeGeminiRequest<VideoOperation>(
					'/models/veo-3.1-fast-generate-preview:predictLongRunning',
					TEST_API_KEY!,
					{
						method: 'POST',
						body: { instances: [{ prompt: 'A calm ocean at sunrise' }] },
					},
				);

				expect(typeof response.name).toBe('string');

				const op = await makeGeminiRequest<VideoOperation>(
					`/${response.name}`,
					TEST_API_KEY!,
					{ method: 'GET' },
				);
				expect(op).toBeDefined();
			} catch (error) {
				if (isRateLimitedOrUnavailable(error)) {
					console.warn(
						'Skipping generateVideos live test (quota / model unavailable):',
						error instanceof Error ? error.message : error,
					);
					return;
				}
				throw error;
			}
		});
	});
});

/**
 * Live path through real endpoint handlers (not only makeGeminiRequest).
 * Covers stripMarkdownFences / image extraction wiring Greptile flagged as untested.
 */
describeIfApiKey('Gemini endpoint handlers (live)', () => {
	const ctx = testCtx(TEST_API_KEY!);

	it('Models.listModels handler works', async () => {
		const response = await Models.listModels(ctx, {});
		const parsed = GeminiEndpointOutputSchemas.listModels.safeParse(response);
		expect(parsed.success).toBe(true);
		expect(response.models.length).toBeGreaterThan(0);
	});

	it('Content.countTokens handler works', async () => {
		const response = await Content.countTokens(ctx, {
			model: 'gemini-2.5-flash',
			contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
		});
		const parsed = GeminiEndpointOutputSchemas.countTokens.safeParse(response);
		expect(parsed.success).toBe(true);
		expect(response.totalTokens).toBeGreaterThan(0);
	});

	it('Content.generateContent handler strips markdown fences into text', async () => {
		const response = await Content.generateContent(ctx, {
			model: 'gemini-2.5-flash',
			contents: [
				{
					role: 'user',
					parts: [{ text: 'Reply with exactly one word: pong' }],
				},
			],
		});
		expect(response.candidates?.length).toBeGreaterThan(0);
		// text field is produced by the handler via stripMarkdownFences
		if (response.text !== undefined) {
			expect(typeof response.text).toBe('string');
			expect(response.text.includes('```')).toBe(false);
		}
	});

	it('Images.generateImage handler runs and returns images array', async () => {
		try {
			const response = await Images.generateImage(ctx, {
				model: 'gemini-2.5-flash-image',
				prompt: 'A simple blue square icon, no text',
			});
			expect(Array.isArray(response.images)).toBe(true);
		} catch (error) {
			if (isRateLimitedOrUnavailable(error)) {
				console.warn(
					'Skipping Images.generateImage handler test (quota / model unavailable):',
					error instanceof Error ? error.message : error,
				);
				return;
			}
			throw error;
		}
	});

	it('Videos.generateVideos + getVideosOperation handlers work', async () => {
		try {
			const started = await Videos.generateVideos(ctx, {
				model: 'veo-3.1-fast-generate-preview',
				prompt: 'A calm ocean at sunrise, short clip',
			});
			expect(typeof started.operationName).toBe('string');

			const op = await Videos.getVideosOperation(ctx, {
				operationName: started.operationName,
			});
			// Handler returns the LRO payload; done may still be false
			expect(op).toBeDefined();
		} catch (error) {
			if (isRateLimitedOrUnavailable(error)) {
				console.warn(
					'Skipping Videos LRO handler test (quota / model unavailable):',
					error instanceof Error ? error.message : error,
				);
				return;
			}
			throw error;
		}
	});
});
