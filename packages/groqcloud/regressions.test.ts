import { ApiError } from 'corsair/http';
import { GroqcloudAPIError } from './client';
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
					file: 'x',
					fileName: 'a.wav',
					model: 'whisper-large-v3-turbo',
					response_format: fmt,
				}),
			).not.toThrow();
		}

		for (const fmt of ['srt', 'vtt']) {
			expect(() =>
				audioSchemas.audioCreateTranscription.input.parse({
					file: 'x',
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
				file: 'x',
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
