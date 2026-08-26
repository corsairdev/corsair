import { ApiError } from 'corsair/http';
import * as clientModule from './client';
import { GroqcloudAPIError } from './client';
import { Endpoints } from './endpoints';
import { errorHandlers } from './error-handlers';
import { GroqcloudSchema } from './schema';
import { audioSchemas } from './schema/audio';
import { chatSchemas } from './schema/chat';
import { modelsSchemas } from './schema/models';

/** Exactly what corsair/http throws for a given status. */
function transportError(status: number, message: string, retryAfter?: number) {
	return new ApiError(
		{ method: 'GET', url: '/models' } as never,
		{
			url: '/models',
			ok: false,
			status,
			statusText: message,
			body: {},
		} as never,
		message,
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

/** Wrapped the way client.ts wraps it. */
function wrapped(status: number, message: string, retryAfter?: number) {
	const cause = transportError(status, message, retryAfter);
	return new GroqcloudAPIError(cause.message, undefined, { cause });
}

describe('rate-limit policy survives the client wrapper', () => {
	it('matches a 429 whose message is "Too Many Requests"', async () => {
		const error = wrapped(429, 'Too Many Requests', 30_000);

		// The message carries no "429"/"rate_limited" — status must be preserved.
		expect(error.message).toBe('Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(res.maxRetries).toBe(5);
		expect(res.headersRetryAfterMs).toBe(30_000);
	});

	it('matches auth failures by status', () => {
		expect(errorHandlers.AUTH_ERROR.match(wrapped(401, 'Unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(wrapped(403, 'Forbidden'))).toBe(
			true,
		);
	});

	it('does not treat an unrelated failure as a rate limit', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				wrapped(500, 'Internal Server Error'),
			),
		).toBe(false);
	});
});

describe('createResponse output schema matches the live API', () => {
	// Captured from POST https://api.groq.com/openai/v1/responses
	const live = {
		id: 'resp_01m0hmhapweceve717t6kr820k',
		object: 'response',
		status: 'completed',
		model: 'openai/gpt-oss-120b',
		created_at: 1766000000,
		output: [
			{
				type: 'reasoning',
				id: 'rs_1',
				status: 'completed',
				content: [{ type: 'reasoning_text', text: 'thinking' }],
			},
			{
				type: 'message',
				id: 'msg_1',
				status: 'completed',
				role: 'assistant',
				content: [{ type: 'output_text', text: 'ok', annotations: [] }],
			},
		],
		text: { format: { type: 'text' } },
		usage: { input_tokens: 78, output_tokens: 36, total_tokens: 114 },
		error: null,
		incomplete_details: null,
	};

	it('parses a real response', () => {
		expect(() =>
			chatSchemas.chatCreateResponse.output.parse(live),
		).not.toThrow();
	});

	it('models `text` as the echoed format config, not the reply', () => {
		const parsed = chatSchemas.chatCreateResponse.output.parse(
			live,
		) as typeof live;
		// The reply lives in output[], not in `text`.
		expect(parsed.text).toEqual({ format: { type: 'text' } });
		const message = parsed.output.find((o) => o.type === 'message');
		expect(message?.content?.[0]?.text).toBe('ok');
	});

	it('rejects the old shape that assumed text was the reply', () => {
		expect(() =>
			chatSchemas.chatCreateResponse.output.parse({ ...live, text: 'ok' }),
		).toThrow();
	});
});

describe('model schema covers the documented fields', () => {
	// Captured from GET https://api.groq.com/openai/v1/models
	const liveModel = {
		id: 'openai/gpt-oss-120b',
		object: 'model',
		created: 1765926400,
		owned_by: 'OpenAI',
		active: true,
		name: 'GPT-OSS 120B',
		context_window: 131072,
		context_length: 131072,
		max_completion_tokens: 32766,
		max_output_length: 32766,
		hugging_face_id: 'openai/gpt-oss-120b',
		input_modalities: ['text'],
		output_modalities: ['text'],
		supported_features: ['tools'],
		supported_sampling_parameters: ['temperature', 'top_p'],
		public_apps: null,
		pricing: { input: 0.15 },
	};

	it('parses a real model object', () => {
		expect(() =>
			modelsSchemas.modelsRetrieveModel.output.parse(liveModel),
		).not.toThrow();
	});

	it('keeps every documented field after parsing', () => {
		const parsed = modelsSchemas.modelsRetrieveModel.output.parse(liveModel);
		for (const key of Object.keys(liveModel)) {
			expect(parsed).toHaveProperty(key);
		}
	});
});

describe('database schema', () => {
	it('registers a models entity', () => {
		expect(Object.keys(GroqcloudSchema.entities)).toEqual(['models']);
	});
});

describe('audio request schema matches the API', () => {
	it('accepts only the response formats Groq supports', () => {
		// Live-verified: srt and vtt return HTTP 400
		// "`response_format` must be one of [json text verbose_json]".
		for (const fmt of ['json', 'text', 'verbose_json']) {
			expect(() =>
				audioSchemas.audioCreateTranscription.input.parse({
					file: new Blob(['x']),
					fileName: 'a.wav',
					model: 'whisper-large-v3-turbo',
					response_format: fmt,
				}),
			).not.toThrow();
		}

		for (const fmt of ['srt', 'vtt']) {
			expect(() =>
				audioSchemas.audioCreateTranscription.input.parse({
					file: new Blob(['x']),
					fileName: 'a.wav',
					model: 'whisper-large-v3-turbo',
					response_format: fmt,
				}),
			).toThrow();
		}
	});

	it('applies the same formats to translation', () => {
		expect(() =>
			audioSchemas.audioCreateTranslation.input.parse({
				file: new Blob(['x']),
				fileName: 'a.wav',
				model: 'whisper-large-v3',
				response_format: 'srt',
			}),
		).toThrow();
	});
});

describe('chat completion streaming contract', () => {
	it('rejects stream:true rather than returning a raw SSE string', () => {
		expect(() =>
			chatSchemas.chatCreateCompletion.input.parse({
				model: 'openai/gpt-oss-120b',
				messages: [{ role: 'user', content: 'hi' }],
				stream: true,
			}),
		).toThrow();
	});

	it('still accepts a non-streaming call', () => {
		expect(() =>
			chatSchemas.chatCreateCompletion.input.parse({
				model: 'openai/gpt-oss-120b',
				messages: [{ role: 'user', content: 'hi' }],
				stream: false,
			}),
		).not.toThrow();
	});
});

describe('model ids keep their namespace segment', () => {
	it('accepts a namespaced model id', () => {
		// 10 of 13 live model IDs contain "/". Percent-encoding the id makes the
		// API return 404, so the path must keep the slash as a real separator.
		expect(() =>
			modelsSchemas.modelsRetrieveModel.input.parse({
				model: 'openai/gpt-oss-120b',
			}),
		).not.toThrow();
	});
});

describe('streaming is blocked at runtime, not just in the schema', () => {
	// The endpoint binder does not parse endpoint schemas, so the declared
	// `stream: false` is metadata only — the guard has to live in the endpoint.
	const ctx = { key: 'k', options: {}, db: {} } as never;

	it('rejects stream:true even though the binder never validates input', async () => {
		const spy = jest.spyOn(clientModule, 'makeGroqcloudRequest');
		try {
			await expect(
				Endpoints.chat.createCompletion(ctx, {
					model: 'openai/gpt-oss-120b',
					messages: [{ role: 'user', content: 'hi' }],
					stream: true,
				} as never),
			).rejects.toThrow(/streaming is not supported/i);

			// The request must never reach the transport.
			expect(spy).not.toHaveBeenCalled();
		} finally {
			spy.mockRestore();
		}
	});

	it('allows a non-streaming call through', async () => {
		const spy = jest
			.spyOn(clientModule, 'makeGroqcloudRequest')
			.mockResolvedValueOnce({ choices: [] } as never);
		try {
			await Endpoints.chat.createCompletion(ctx, {
				model: 'openai/gpt-oss-120b',
				messages: [{ role: 'user', content: 'hi' }],
			} as never);

			expect(spy).toHaveBeenCalledTimes(1);
		} finally {
			spy.mockRestore();
		}
	});
});

describe('multipart rate limits preserve Retry-After', () => {
	function mockFetch(status: number, headers: Record<string, string>) {
		return jest.fn(async () => ({
			ok: status < 400,
			status,
			statusText: 'Too Many Requests',
			headers: new Headers(headers),
			text: async () => '{"error":{"message":"rate limited"}}',
		})) as unknown as typeof fetch;
	}

	it('parses Retry-After seconds into milliseconds', async () => {
		const original = global.fetch;
		global.fetch = mockFetch(429, { 'retry-after': '2.5' });
		try {
			const error = (await clientModule
				.multipartGroqcloudRequest('audio/transcriptions', 'k', {
					files: [{ field: 'file', file: 'x', fileName: 'a.wav' }],
				})
				.catch((e: unknown) => e)) as clientModule.GroqcloudAPIError;

			expect(error.status).toBe(429);
			expect(error.retryAfter).toBe(2500);
			// and the policy can now actually use it
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
			expect(
				(await errorHandlers.RATE_LIMIT_ERROR.handler(error))
					.headersRetryAfterMs,
			).toBe(2500);
		} finally {
			global.fetch = original;
		}
	});

	it('tolerates a missing Retry-After header', async () => {
		const original = global.fetch;
		global.fetch = mockFetch(429, {});
		try {
			const error = (await clientModule
				.multipartGroqcloudRequest('audio/transcriptions', 'k', {
					files: [{ field: 'file', file: 'x', fileName: 'a.wav' }],
				})
				.catch((e: unknown) => e)) as clientModule.GroqcloudAPIError;

			expect(error.status).toBe(429);
			expect(error.retryAfter).toBeUndefined();
		} finally {
			global.fetch = original;
		}
	});
});

describe('audio input accepts a file or a url, never both', () => {
	const base = { model: 'whisper-large-v3-turbo' };

	it('accepts an uploaded file with a name', () => {
		expect(() =>
			audioSchemas.audioCreateTranscription.input.parse({
				...base,
				file: new Blob(['x']),
				fileName: 'a.wav',
			}),
		).not.toThrow();
	});

	it('accepts a url with no file', () => {
		// Live-verified: Groq fetches `url` server-side. A bogus field returns
		// "unknown param", whereas `url` produces a media-retrieval error.
		expect(() =>
			audioSchemas.audioCreateTranscription.input.parse({
				...base,
				url: 'https://example.com/a.wav',
			}),
		).not.toThrow();
	});

	it('rejects a plain string as file', () => {
		// A string is uploaded as literal UTF-8 bytes; the API answers
		// "could not process file - is it a valid media file?".
		expect(() =>
			audioSchemas.audioCreateTranscription.input.parse({
				...base,
				file: 'not-audio',
				fileName: 'a.wav',
			}),
		).toThrow();
	});

	it('rejects both file and url together', () => {
		expect(() =>
			audioSchemas.audioCreateTranscription.input.parse({
				...base,
				file: new Blob(['x']),
				fileName: 'a.wav',
				url: 'https://example.com/a.wav',
			}),
		).toThrow();
	});

	it('rejects neither file nor url', () => {
		expect(() =>
			audioSchemas.audioCreateTranscription.input.parse(base),
		).toThrow();
	});

	it('requires fileName alongside file', () => {
		expect(() =>
			audioSchemas.audioCreateTranscription.input.parse({
				...base,
				file: new Blob(['x']),
			}),
		).toThrow();
	});
});
