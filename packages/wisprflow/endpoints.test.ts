import { createCorsair, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { generate, revoke, revokeClient } from './endpoints/tokens';
import { create, warmup } from './endpoints/transcriptions';
import { errorHandlers } from './error-handlers';
import { wisprflow } from './index';
import { WisprFlowSchema } from './schema';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

type Ctx = Parameters<typeof create>[0];

const upserts: Array<[string, unknown]> = [];

// Safe: the endpoints read only `key` and `db.transcription`; the runtime builds the rest from a live database.
const ctx = {
	key: 'fl-test',
	db: {
		transcription: {
			upsertByEntityId: async (id: string, data: unknown) => {
				upserts.push([id, data]);
				return null;
			},
		},
	},
} as unknown as Ctx;

const BASE = 'https://platform-api.wisprflow.ai/api/v1/dash';

const TRANSCRIPTION = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	text: 'Testing testing 1, 2, 3',
	detected_language: 'en',
	total_time: 432,
	generated_tokens: 9,
};

function json(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('Wispr Flow endpoints', () => {
	const originalFetch = global.fetch;
	let fetchMock: jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();
		upserts.length = 0;
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	function sent() {
		const [url, init] = fetchMock.mock.calls[0];
		return {
			url: String(url),
			method: init.method,
			body: init.body ? JSON.parse(init.body) : undefined,
			headers: new Headers(init.headers),
		};
	}

	it('transcriptions.create posts audio with defaults, persists, and logs no user content', async () => {
		fetchMock.mockResolvedValue(json(200, TRANSCRIPTION));

		const result = await create(ctx, { audio: 'UklGRiQA' });

		const call = sent();
		expect(call.method).toBe('POST');
		expect(call.url).toBe(`${BASE}/api`);
		expect(call.headers.get('Authorization')).toBe('Bearer fl-test');
		expect(call.body).toEqual({ audio: 'UklGRiQA', language: [], context: {} });
		expect(result).toEqual(TRANSCRIPTION);
		expect(upserts).toEqual([[TRANSCRIPTION.id, TRANSCRIPTION]]);
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'wisprflow.transcriptions.create',
			{ language: [] },
			'completed',
		);
	});

	it('transcriptions.create forwards context but keeps it out of the event log', async () => {
		fetchMock.mockResolvedValue(json(200, TRANSCRIPTION));
		const context = {
			app: { name: 'Gmail', type: 'email' as const },
			user_first_name: 'Ada',
			textbox_contents: { before_text: 'Hi team,' },
			conversation: {
				id: 'c1',
				messages: [{ role: 'user' as const, content: 'draft a reply' }],
			},
		};

		await create(ctx, { audio: 'UklGRiQA', language: ['en'], context });

		expect(sent().body).toEqual({
			audio: 'UklGRiQA',
			language: ['en'],
			context,
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'wisprflow.transcriptions.create',
			{ language: ['en'] },
			'completed',
		);
	});

	it('transcriptions.create rejects empty audio before any request', async () => {
		await expect(create(ctx, { audio: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('transcriptions.create surfaces a 413 as ApiError with the provider detail and stores nothing', async () => {
		fetchMock.mockResolvedValue(
			json(413, { detail: 'Audio file size exceeds 25MB limit' }),
		);

		const error = await create(ctx, { audio: 'UklGRiQA' }).catch((e) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(413);
		expect(error.message).toBe('Audio file size exceeds 25MB limit');
		expect(upserts).toEqual([]);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('transcriptions.create rejects a response missing the transcription id', async () => {
		const { id: _, ...withoutId } = TRANSCRIPTION;
		fetchMock.mockResolvedValue(json(200, withoutId));

		await expect(create(ctx, { audio: 'UklGRiQA' })).rejects.toThrow();
		expect(upserts).toEqual([]);
	});

	it('transcriptions.warmup GETs /warmup_dash', async () => {
		fetchMock.mockResolvedValue(json(200, { status: 'warmed' }));

		await expect(warmup(ctx, {})).resolves.toEqual({ status: 'warmed' });
		expect(sent()).toMatchObject({ method: 'GET', url: `${BASE}/warmup_dash` });
	});

	it('tokens.generate returns the JWT but logs only the client and duration', async () => {
		const token = { access_token: 'eyJhbGciOi.secret', expires_in: 3600 };
		fetchMock.mockResolvedValue(json(200, token));
		const input = {
			client_id: 'client123',
			duration_secs: 3600,
			metadata: { user_name: 'John Doe' },
		};

		await expect(generate(ctx, input)).resolves.toEqual(token);
		expect(sent()).toMatchObject({
			method: 'POST',
			url: `${BASE}/generate_access_token`,
			body: input,
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'wisprflow.tokens.generate',
			{ client_id: 'client123', duration_secs: 3600 },
			'completed',
		);
	});

	it('tokens.generate rejects a non-positive duration before any request', async () => {
		await expect(
			generate(ctx, { client_id: 'client123', duration_secs: 0 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('tokens.revoke posts the token and never logs it', async () => {
		const ok = { status: 'success', message: 'Token successfully revoked' };
		fetchMock.mockResolvedValue(json(200, ok));

		await expect(
			revoke(ctx, { access_token: 'eyJhbGciOi.secret' }),
		).resolves.toEqual(ok);
		expect(sent()).toMatchObject({
			url: `${BASE}/revoke_token`,
			body: { access_token: 'eyJhbGciOi.secret' },
		});
		expect(logEventFromContext).toHaveBeenCalledWith(
			ctx,
			'wisprflow.tokens.revoke',
			{},
			'completed',
		);
	});

	it('tokens.revokeClient posts the client id and surfaces a 404', async () => {
		const ok = {
			status: 'success',
			message: 'All tokens for client successfully revoked',
		};
		fetchMock.mockResolvedValueOnce(json(200, ok));

		await expect(
			revokeClient(ctx, { client_id: 'client123' }),
		).resolves.toEqual(ok);
		expect(sent()).toMatchObject({
			url: `${BASE}/revoke_client_tokens`,
			body: { client_id: 'client123' },
		});

		fetchMock.mockResolvedValueOnce(
			json(404, { detail: 'No tokens found for this client' }),
		);
		await expect(
			revokeClient(ctx, { client_id: 'nobody' }),
		).rejects.toMatchObject({
			status: 404,
		});
	});
});

describe('Wispr Flow error handlers', () => {
	const apiError = (status: number) =>
		new ApiError(
			{ method: 'POST', url: '/api' },
			{ url: '/api', ok: false, status, statusText: '', body: {} },
			'failed',
		);

	it('routes 429 and 401 to their handlers without extra retries', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(429))).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError(500))).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(apiError(401))).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('401'))).toBe(false);
		await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});
});

describe('Wispr Flow through a Corsair client', () => {
	const originalFetch = global.fetch;
	let fetchMock: jest.Mock;

	async function createClient(options: { key?: string }) {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'wisprflow', 'default');
		const corsair = createCorsair({
			plugins: [wisprflow(options)],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.wisprflow.keys.issue_new_dek();
		await corsair.wisprflow.keys.set_api_key('fl-stored');
		return { corsair, testDb };
	}

	beforeEach(() => {
		fetchMock = jest.fn();
		global.fetch = fetchMock;
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	it('sends the stored key as a Bearer token and syncs the transcription', async () => {
		fetchMock.mockResolvedValue(json(200, TRANSCRIPTION));
		const { corsair, testDb } = await createClient({});
		try {
			const result = await corsair.wisprflow.api.transcriptions.create({
				audio: 'UklGRiQA',
			});

			const [url, init] = fetchMock.mock.calls[0];
			expect(String(url)).toBe(`${BASE}/api`);
			expect(new Headers(init.headers).get('Authorization')).toBe(
				'Bearer fl-stored',
			);
			expect(result).toEqual(TRANSCRIPTION);
			const stored = await corsair.wisprflow.db.transcription.findByEntityId(
				TRANSCRIPTION.id,
			);
			expect(stored?.data).toEqual(TRANSCRIPTION);
		} finally {
			testDb.cleanup();
		}
	});

	it('prefers the key plugin option over the stored key', async () => {
		fetchMock.mockResolvedValue(json(200, { status: 'warmed' }));
		const { corsair, testDb } = await createClient({ key: 'fl-option' });
		try {
			await corsair.wisprflow.api.transcriptions.warmup({});

			const [, init] = fetchMock.mock.calls[0];
			expect(new Headers(init.headers).get('Authorization')).toBe(
				'Bearer fl-option',
			);
		} finally {
			testDb.cleanup();
		}
	});

	it('fails a rejected key once, without retrying', async () => {
		fetchMock.mockImplementation(async () =>
			json(401, { detail: 'Unauthorized' }),
		);
		const { corsair, testDb } = await createClient({});
		try {
			const error = await corsair.wisprflow.api.transcriptions
				.warmup({})
				.catch((e: unknown) => e);

			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			testDb.cleanup();
		}
	});
});

describe('Wispr Flow schema', () => {
	it('stores transcriptions and nothing else', () => {
		expect(WisprFlowSchema.version).toBe('1.0.0');
		expect(Object.keys(WisprFlowSchema.entities)).toEqual(['transcription']);
		expect(() =>
			WisprFlowSchema.entities.transcription.parse({ id: 'x', text: 'hi' }),
		).toThrow();
		// The client-side spec types total_time as a number, not an integer.
		expect(
			WisprFlowSchema.entities.transcription.parse({
				...TRANSCRIPTION,
				total_time: 432.5,
			}).total_time,
		).toBe(432.5);
	});
});
