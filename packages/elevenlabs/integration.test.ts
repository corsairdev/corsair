import { processWebhook } from 'corsair';
import type { CorsairErrorHandler } from 'corsair/core';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { elevenlabs } from './index';
import {
	postCallTranscriptionEvent,
	signDelivery,
	transcriptionEvent,
	WEBHOOK_SECRET,
} from './test-fixtures';

type Options = Parameters<typeof elevenlabs>[0];

async function createClient(
	options: Options,
	config: {
		errorHandlers?: CorsairErrorHandler;
		encryptDataAtRest?: boolean;
		kek?: string;
	} = {},
) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'elevenlabs', 'default');
	const corsair = createCorsair({
		plugins: [elevenlabs(options)],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		...config,
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200, headers = {}) {
	fetchMock.mockImplementationOnce(
		async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json', ...headers },
			}),
	);
}

const refusal = (code: string) => ({
	detail: {
		type: 'rate_limit_error',
		code,
		message: 'Slow down',
		request_id: 'r',
	},
});

const SPEECH = { voiceId: 'v', text: 'Hi' };

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
	jest.spyOn(console, 'error').mockImplementation(() => undefined);
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
	// Backoff waits run at once; what's being checked is how many attempts there are.
	jest.spyOn(globalThis, 'setTimeout').mockImplementation(((fn: () => void) => {
		fn();
		return 0;
	}) as never);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('auth', () => {
	it('fails fast with AuthMissingError when no key is stored', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.elevenlabs.keys.issue_new_dek();
			await expect(corsair.elevenlabs.api.models.list({})).rejects.toThrow(
				/auth-missing/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('sends the stored key as xi-api-key', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.elevenlabs.keys.issue_new_dek();
			await corsair.elevenlabs.keys.set_api_key('sk_stored');
			respond([]);
			await corsair.elevenlabs.api.models.list({});
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.elevenlabs.io/v1/models');
			expect(new Headers(init.headers).get('xi-api-key')).toBe('sk_stored');
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers the key option', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk_option' });
		try {
			respond([]);
			await corsair.elevenlabs.api.models.list({});
			const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(new Headers(init.headers).get('xi-api-key')).toBe('sk_option');
		} finally {
			testDb.cleanup();
		}
	});
});

describe('retries', () => {
	const audio = () =>
		fetchMock.mockImplementationOnce(
			async () =>
				new Response(new Uint8Array([1]), {
					headers: { 'Content-Type': 'audio/mpeg' },
				}),
		);

	it.each([
		'rate_limit_exceeded',
		'concurrent_limit_exceeded',
		'system_busy',
		'too_many_concurrent_requests',
	])('retries a paid POST refused with 429 %s', async (code) => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond(refusal(code), 429);
			audio();
			const result = await corsair.elevenlabs.api.textToSpeech.convert(SPEECH);
			expect(result.byteLength).toBe(1);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('gives up after three retries', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			for (let i = 0; i < 5; i++) respond(refusal('system_busy'), 429);
			await expect(
				corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
			).rejects.toThrow(/system_busy/);
			expect(fetchMock).toHaveBeenCalledTimes(4);
		} finally {
			testDb.cleanup();
		}
	});

	it('waits as long as Retry-After says', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond(refusal('rate_limit_exceeded'), 429, { 'Retry-After': '4' });
			audio();
			await corsair.elevenlabs.api.textToSpeech.convert(SPEECH);
			// unknown: jest's spy type doesn't line up with setTimeout's overloads.
			const waits = (
				globalThis.setTimeout as unknown as jest.Mock
			).mock.calls.map((call) => call[1]);
			expect(waits).toContain(4000);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not sit through a Retry-After too long for one call', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond(refusal('rate_limit_exceeded'), 429, { 'Retry-After': '3600' });
			await expect(
				corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
			).rejects.toThrow(/rate_limit_exceeded/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a paid POST on a 429 it cannot place', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond({ detail: 'Too many requests' }, 429);
			await expect(
				corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
			).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it.each([500, 502, 503, 504])(
		'never retries a paid POST on %i',
		async (status) => {
			const { corsair, testDb } = await createClient({ key: 'sk' });
			try {
				respond({ detail: { code: 'internal', message: 'Oops' } }, status);
				await expect(
					corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
				).rejects.toThrow(String(status));
				expect(fetchMock).toHaveBeenCalledTimes(1);
			} finally {
				testDb.cleanup();
			}
		},
	);

	it('never retries a paid POST on a network failure or timeout', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			await expect(
				corsair.elevenlabs.api.music.compose({ prompt: 'piano' }),
			).rejects.toThrow(/may still have run/);
			expect(fetchMock).toHaveBeenCalledTimes(1);

			fetchMock.mockClear();
			const timeout = new Error('timed out');
			timeout.name = 'TimeoutError';
			fetchMock.mockRejectedValueOnce(timeout);
			await expect(
				corsair.elevenlabs.api.soundEffects.generate({ text: 'x' }),
			).rejects.toThrow(/timed out/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it.each([401, 402, 403])('does not retry %i', async (status) => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond({ detail: { code: 'no', message: 'No' } }, status);
			await expect(
				corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
			).rejects.toThrow(String(status));
			expect(fetchMock).toHaveBeenCalledTimes(1);

			fetchMock.mockClear();
			respond({ detail: { code: 'no', message: 'No' } }, status);
			await expect(corsair.elevenlabs.api.voices.list({})).rejects.toThrow();
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read on 5xx, then gives up', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond({ detail: 'Oops' }, 503);
			respond([]);
			await expect(corsair.elevenlabs.api.models.list({})).resolves.toEqual({
				models: [],
			});
			expect(fetchMock).toHaveBeenCalledTimes(2);

			fetchMock.mockClear();
			for (let i = 0; i < 5; i++) respond({ detail: 'Oops' }, 500);
			await expect(corsair.elevenlabs.api.models.list({})).rejects.toThrow(
				'500',
			);
			expect(fetchMock).toHaveBeenCalledTimes(3);
		} finally {
			testDb.cleanup();
		}
	});

	it('retries a read on any 429', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond({ detail: 'Too many requests' }, 429);
			respond([]);
			await corsair.elevenlabs.api.models.list({});
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('does not retry a delete on 5xx', async () => {
		const { corsair, testDb } = await createClient({ key: 'sk' });
		try {
			respond({ detail: 'Oops' }, 500);
			await expect(
				corsair.elevenlabs.api.history.delete({ historyItemId: 'h' }),
			).rejects.toThrow('500');
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('custom error handlers', () => {
	const is503 = (error: Error) => (error as { status?: number }).status === 503;

	const audio = () =>
		fetchMock.mockImplementationOnce(
			async () =>
				new Response(new Uint8Array([1]), {
					headers: { 'Content-Type': 'audio/mpeg' },
				}),
		);

	it('runs a new handler passed to the plugin', async () => {
		const handler = jest.fn(async () => ({ maxRetries: 1 }));
		const { corsair, testDb } = await createClient({
			key: 'sk',
			errorHandlers: { MY_503: { match: is503, handler } },
		});
		try {
			respond({ detail: 'Oops' }, 503);
			audio();
			await corsair.elevenlabs.api.textToSpeech.convert(SPEECH);
			expect(handler).toHaveBeenCalled();
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs it ahead of a built-in that matches the same error', async () => {
		const handler = jest.fn(async () => ({ maxRetries: 0 }));
		const { corsair, testDb } = await createClient({
			key: 'sk',
			errorHandlers: { MY_429: { match: () => true, handler } },
		});
		try {
			respond(refusal('system_busy'), 429);
			await expect(
				corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
			).rejects.toThrow(/system_busy/);
			expect(handler).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('replaces a built-in of the same name', async () => {
		const handler = jest.fn(async () => ({ maxRetries: 0 }));
		const { corsair, testDb } = await createClient({
			key: 'sk',
			errorHandlers: {
				RATE_LIMIT_ERROR: { match: () => true, handler },
			},
		});
		try {
			respond(refusal('system_busy'), 429);
			await expect(
				corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
			).rejects.toThrow();
			expect(handler).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('keeps a custom DEFAULT as the last resort', async () => {
		const fallback = jest.fn(async () => ({ maxRetries: 0 }));
		const { corsair, testDb } = await createClient({
			key: 'sk',
			errorHandlers: { DEFAULT: { match: () => true, handler: fallback } },
		});
		try {
			respond(refusal('system_busy'), 429);
			audio();
			await corsair.elevenlabs.api.textToSpeech.convert(SPEECH);
			expect(fallback).not.toHaveBeenCalled();
			expect(fetchMock).toHaveBeenCalledTimes(2);

			respond({ detail: 'Oops' }, 500);
			await expect(
				corsair.elevenlabs.api.textToSpeech.convert(SPEECH),
			).rejects.toThrow('500');
			expect(fallback).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('lets a root handler retry a generation, as the client’s comment says', async () => {
		const handler = jest.fn(async () => ({ maxRetries: 1 }));
		const { corsair, testDb } = await createClient(
			{ key: 'sk' },
			{ errorHandlers: { ROOT_503: { match: is503, handler } } },
		);
		try {
			respond({ detail: 'Oops' }, 503);
			audio();
			await corsair.elevenlabs.api.textToSpeech.convert(SPEECH);
			expect(handler).toHaveBeenCalled();
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});

	it('still retries a refused generation when the root sets a DEFAULT', async () => {
		// Core puts the root's keys first, so a plugin DEFAULT that matched
		// everything would sit ahead of RATE_LIMIT_ERROR and end the search.
		const { corsair, testDb } = await createClient(
			{ key: 'sk' },
			{
				errorHandlers: {
					DEFAULT: {
						match: () => true,
						handler: async () => ({ maxRetries: 0 }),
					},
				},
			},
		);
		try {
			respond(refusal('system_busy'), 429);
			audio();
			await corsair.elevenlabs.api.textToSpeech.convert(SPEECH);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('a log entry that can’t be written', () => {
	it('doesn’t throw away audio that’s already paid for', async () => {
		// With encryptDataAtRest and no KEK, core's logger throws, after the generation.
		const { corsair, testDb } = await createClient(
			{ key: 'sk' },
			{ encryptDataAtRest: true, kek: '' },
		);
		try {
			fetchMock.mockImplementationOnce(
				async () =>
					new Response(new Uint8Array([1, 2]), {
						headers: { 'Content-Type': 'audio/mpeg' },
					}),
			);
			const warn = jest
				.spyOn(console, 'warn')
				.mockImplementation(() => undefined);
			const outcome = await corsair.elevenlabs.api.textToSpeech
				.convert(SPEECH)
				.then(
					(result) => ({ result }),
					(error: Error) => ({ error }),
				);
			if ('error' in outcome) {
				// Newer core refuses before the request, so nothing is paid for.
				expect(outcome.error.name).toBe('CorsairKekMissingError');
				expect(fetchMock).not.toHaveBeenCalled();
				return;
			}
			expect(outcome.result.byteLength).toBe(2);
			expect(outcome.result.contentBase64).toBe('AQI=');
			expect(fetchMock).toHaveBeenCalledTimes(1);
			// The missing KEK still shows up, the way core's logger reports it.
			expect(warn).toHaveBeenCalledWith(
				'Failed to log event:',
				expect.objectContaining({ message: 'encryptDataAtRest requires kek' }),
			);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('webhooks through processWebhook', () => {
	const deliver = (corsair: never, signed: ReturnType<typeof signDelivery>) =>
		processWebhook(corsair, signed.headers, signed.rawBody);

	it('routes a signed delivery, with the secret from the option', async () => {
		const { corsair, testDb } = await createClient({
			webhookSecret: WEBHOOK_SECRET,
		});
		try {
			const result = await deliver(corsair as never, signDelivery());
			expect(result.plugin).toBe('elevenlabs');
			expect(result.action).toBe('speechToText.transcriptionCompleted');
			expect(result.response).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('reads the secret from the keys system', async () => {
		const { corsair, testDb } = await createClient({});
		try {
			await corsair.elevenlabs.keys.issue_new_dek();
			await corsair.elevenlabs.keys.set_webhook_signature(WEBHOOK_SECRET);
			const signed = signDelivery({ body: postCallTranscriptionEvent });
			const result = await deliver(corsair as never, signed);
			expect(result.action).toBe('conversations.postCallTranscription');
			expect(result.response).toEqual({ success: true });
		} finally {
			testDb.cleanup();
		}
	});

	it('fails closed before any hook runs when no secret is configured', async () => {
		const before = jest.fn(async (ctx, args) => ({
			ctx,
			args,
			continue: true,
		}));
		const { corsair, testDb } = await createClient({
			webhookHooks: {
				speechToText: { transcriptionCompleted: { before } },
			} as never,
		});
		try {
			await corsair.elevenlabs.keys.issue_new_dek();
			const result = await deliver(corsair as never, signDelivery());
			expect(result.response?.success).toBe(false);
			expect(before).not.toHaveBeenCalled();

			// The same delivery goes through once the secret is there.
			await corsair.elevenlabs.keys.set_webhook_signature(WEBHOOK_SECRET);
			const accepted = await deliver(corsair as never, signDelivery());
			expect(accepted.response).toEqual({ success: true });
			expect(before).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});

	it('leaves a delivery for another plugin alone', async () => {
		const { corsair, testDb } = await createClient({
			webhookSecret: WEBHOOK_SECRET,
		});
		try {
			const result = await processWebhook(
				corsair,
				{ 'content-type': 'application/json' },
				JSON.stringify(transcriptionEvent),
			);
			expect(result.plugin).not.toBe('elevenlabs');
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a forged delivery as a failure, not an acknowledgement', async () => {
		const { corsair, testDb } = await createClient({
			webhookSecret: WEBHOOK_SECRET,
		});
		try {
			const result = await deliver(
				corsair as never,
				signDelivery({ secret: 'forged' }),
			);
			expect(result.plugin).toBe('elevenlabs');
			expect(result.response).toEqual({
				success: false,
				error: 'Invalid ElevenLabs webhook signature',
			});
		} finally {
			testDb.cleanup();
		}
	});

	it('reports a signed payload its schema refuses as a failure, and runs no after hook', async () => {
		const after = jest.fn();
		const { corsair, testDb } = await createClient({
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: {
				conversations: { postCallTranscription: { after } },
			} as never,
		});
		try {
			const result = await deliver(
				corsair as never,
				signDelivery({
					body: { type: 'post_call_transcription', data: 'not an object' },
				}),
			);
			expect(result.action).toBe('conversations.postCallTranscription');
			expect(result.response?.success).toBe(false);
			expect(result.response?.error).toMatch(/did not match its schema/);
			expect(after).not.toHaveBeenCalled();
		} finally {
			testDb.cleanup();
		}
	});

	it('uses the secret of the tenant named in the URL query', async () => {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'elevenlabs', 'acme');
		const corsair = createCorsair({
			plugins: [elevenlabs()],
			database: testDb.db,
			kek: '0123456789abcdef0123456789abcdef',
			multiTenancy: true,
		});
		try {
			const acme = corsair.withTenant('acme');
			await acme.elevenlabs.keys.issue_new_dek();
			await acme.elevenlabs.keys.set_webhook_signature(WEBHOOK_SECRET);
			const signed = signDelivery();

			// What the docs' handler does with the request's URL.
			const url = new URL('https://example.com/webhooks?tenantId=acme');
			const query = Object.fromEntries(url.searchParams);
			const routed = await processWebhook(
				corsair as never,
				signed.headers,
				signed.rawBody,
				query,
			);
			expect(routed.response).toEqual({ success: true });

			const unrouted = await processWebhook(
				corsair as never,
				signed.headers,
				signed.rawBody,
			);
			expect(unrouted.response?.success).toBe(false);
		} finally {
			testDb.cleanup();
		}
	});

	it('runs the hooks on a good delivery and only before on a forged one', async () => {
		const after = jest.fn();
		const before = jest.fn(async (ctx, args) => ({
			ctx,
			args,
			continue: true,
		}));
		const { corsair, testDb } = await createClient({
			webhookSecret: WEBHOOK_SECRET,
			webhookHooks: {
				speechToText: { transcriptionCompleted: { before, after } },
			} as never,
		});
		try {
			await deliver(corsair as never, signDelivery());
			expect(before).toHaveBeenCalledTimes(1);
			expect(after).toHaveBeenCalledTimes(1);

			// The known core gap: before runs ahead of the signature check, in every
			// plugin. after does not, so a forged delivery reaches no handler code.
			await deliver(corsair as never, signDelivery({ secret: 'forged' }));
			expect(before).toHaveBeenCalledTimes(2);
			expect(after).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});
