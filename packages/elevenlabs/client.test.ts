import { ApiError } from 'corsair/http';
import {
	base64ByteLength,
	contentTypeOfOutputFormat,
	DEFAULT_MAX_CONTENT_BYTES,
	decodeBase64,
	ElevenLabsAPIError,
	ElevenLabsRequestError,
	elevenLabsBinary,
	elevenLabsJson,
	HARD_MAX_CONTENT_BYTES,
	parseErrorBody,
	parseRetryAfterMs,
	pathId,
	toBinaryResult,
} from './client';

const KEY = 'sk_test_key_123';
let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	jest.restoreAllMocks();
});

/** The error a call rejects with. */
// unknown: only whether it rejects matters here, not what it resolves to.
const failure = (call: Promise<unknown>) =>
	call.then(
		() => {
			throw new Error('expected the call to reject');
		},
		(error) => error as ElevenLabsAPIError,
	);

const jsonResponse = (
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});

describe('parseErrorBody', () => {
	it('reads the object form', () => {
		expect(
			parseErrorBody(
				{
					detail: {
						type: 'validation_error',
						code: 'invalid_parameters',
						message: 'keyterms needs scribe_v2',
						status: 'invalid_parameters',
						request_id: '3c80',
						param: 'keyterms',
					},
				},
				'x',
			),
		).toEqual({
			message: 'keyterms needs scribe_v2',
			code: 'invalid_parameters',
			type: 'validation_error',
			requestId: '3c80',
			param: 'keyterms',
		});
	});

	it('falls back to detail.status for the older object form', () => {
		const parsed = parseErrorBody(
			{ detail: { status: 'too_many_concurrent_requests', message: 'Slow' } },
			'x',
		);
		expect(parsed.code).toBe('too_many_concurrent_requests');
		expect(parsed.message).toBe('Slow');
	});

	it('reads the legacy string form', () => {
		expect(parseErrorBody({ detail: 'Not Found' }, 'x')).toEqual({
			message: 'Not Found',
		});
	});

	it('reads the validation list form', () => {
		const parsed = parseErrorBody(
			{
				detail: [
					{ type: 'missing', loc: ['body', 'text'], msg: 'Field required' },
					{ type: 'missing', loc: ['body', 'name'], msg: 'Field required' },
				],
			},
			'x',
		);
		expect(parsed.message).toBe(
			'body.text: Field required; body.name: Field required',
		);
		expect(parsed.param).toBe('body.text');
		expect(parsed.type).toBe('validation_error');
	});

	it('survives bodies that are none of these', () => {
		expect(parseErrorBody('<html>Bad gateway</html>', 'x').message).toBe(
			'<html>Bad gateway</html>',
		);
		expect(parseErrorBody({ other: 1 }, 'fallback').message).toBe('fallback');
		expect(parseErrorBody(null, 'fallback').message).toBe('fallback');
		expect(parseErrorBody({ detail: [{}] }, 'fallback').message).toBe(
			'fallback',
		);
	});
});

describe('parseRetryAfterMs', () => {
	it('reads seconds', () => {
		expect(parseRetryAfterMs('7')).toBe(7000);
	});
	it('reads an HTTP date', () => {
		const at = new Date(Date.now() + 10_000).toUTCString();
		expect(parseRetryAfterMs(at)).toBeGreaterThan(0);
	});
	it('ignores nothing and rubbish', () => {
		expect(parseRetryAfterMs(null)).toBeUndefined();
		expect(parseRetryAfterMs('soon')).toBeUndefined();
	});
});

describe('requests', () => {
	it('sends the key only as xi-api-key, to the API host', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
		await elevenLabsJson('/v1/user', KEY);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.elevenlabs.io/v1/user');
		const headers = new Headers(init.headers);
		expect(headers.get('xi-api-key')).toBe(KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(url).not.toContain(KEY);
	});

	it('writes query values, repeats arrays and skips undefined', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));
		await elevenLabsJson('/v2/voices', KEY, {
			query: { a: 'x', b: 2, c: false, d: undefined, ids: ['1', '2'] },
		});
		const url = new URL(fetchMock.mock.calls[0]?.[0] as string);
		expect(url.searchParams.get('a')).toBe('x');
		expect(url.searchParams.get('b')).toBe('2');
		expect(url.searchParams.get('c')).toBe('false');
		expect(url.searchParams.has('d')).toBe(false);
		expect(url.searchParams.getAll('ids')).toEqual(['1', '2']);
	});

	it('accepts an empty body from a delete', async () => {
		fetchMock.mockResolvedValueOnce(new Response('', { status: 200 }));
		await expect(
			elevenLabsJson('/v1/x', KEY, { method: 'DELETE' }),
		).resolves.toEqual({});
	});

	it('refuses a success that is not JSON', async () => {
		fetchMock.mockResolvedValueOnce(new Response('<html>', { status: 200 }));
		await expect(elevenLabsJson('/v1/x', KEY)).rejects.toThrow(/isn't JSON/);
	});

	it('throws an ApiError with code, message and request id', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					detail: {
						type: 'not_found',
						code: 'voice_not_found',
						message: 'No such voice',
						request_id: 'req_1',
						param: 'voice_id',
					},
				},
				404,
			),
		);
		const error = await failure(elevenLabsJson('/v1/voices/x', KEY));
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toBeInstanceOf(ElevenLabsAPIError);
		expect(error.status).toBe(404);
		expect(error.code).toBe('voice_not_found');
		expect(error.requestId).toBe('req_1');
		expect(error.param).toBe('voice_id');
		expect(error.errorType).toBe('not_found');
		expect(error.message).toBe(
			'ElevenLabs 404 voice_not_found: No such voice (request id req_1)',
		);
	});

	it('uses x-trace-id when the body names no request', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: 'nope' }, 400, { 'x-trace-id': 'trace_9' }),
		);
		const error = await failure(elevenLabsJson('/v1/x', KEY));
		expect(error.requestId).toBe('trace_9');
		expect(error.message).toContain('trace_9');
	});

	it('explains 402 plainly', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					detail: {
						type: 'payment_required',
						code: 'insufficient_credits',
						message: 'Not enough credits',
					},
				},
				402,
			),
		);
		await expect(elevenLabsJson('/v1/x', KEY)).rejects.toThrow(
			/Nothing was generated; add credits/,
		);
	});

	it.each(['POST', 'PATCH', 'DELETE'] as const)(
		'warns a %s that answered 5xx may have run and could bill again',
		async (method) => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ detail: { code: 'internal', message: 'Oops' } }, 500),
			);
			const error = await failure(elevenLabsJson('/v1/x', KEY, { method }));
			expect(error.status).toBe(500);
			expect(error.message).toMatch(/may still have run it/);
			expect(error.message).toMatch(/a generation bills again/);
		},
	);

	it('doesn’t warn on a read that answered 5xx, or a POST refused with 4xx', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'Oops' }, 500));
		const read = await failure(elevenLabsJson('/v1/x', KEY));
		expect(read.message).not.toMatch(/may still have run/);

		fetchMock.mockResolvedValueOnce(jsonResponse({ detail: 'Bad' }, 400));
		const bad = await failure(elevenLabsJson('/v1/x', KEY, { method: 'POST' }));
		expect(bad.message).not.toMatch(/may still have run/);
	});

	it('carries Retry-After on the error', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ detail: { code: 'system_busy', message: 'Busy' } }, 429, {
				'Retry-After': '3',
			}),
		);
		const error = await failure(elevenLabsJson('/v1/x', KEY));
		expect(error.retryAfter).toBe(3000);
	});

	describe('the key never leaves in an error', () => {
		it('scrubs it from an error body the API echoes it in', async () => {
			fetchMock.mockResolvedValueOnce(
				jsonResponse({ detail: `Invalid key ${KEY}` }, 401),
			);
			const error = await failure(elevenLabsJson('/v1/user', KEY));
			expect(error.message).not.toContain(KEY);
			expect(JSON.stringify(error.body)).not.toContain(KEY);
			expect(JSON.stringify(error.request)).not.toContain(KEY);
			expect(error.message).toContain('[redacted]');
		});

		it('scrubs it from a network failure', async () => {
			fetchMock.mockRejectedValueOnce(new Error(`connect failed for ${KEY}`));
			const error = await failure(elevenLabsJson('/v1/user', KEY));
			expect(error).toBeInstanceOf(ElevenLabsRequestError);
			expect(error.message).not.toContain(KEY);
		});
	});

	describe('faults with no answer', () => {
		it('warns a failed POST may have run', async () => {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			await expect(
				elevenLabsBinary('/v1/music', KEY, { method: 'POST', json: {} }),
			).rejects.toThrow(/may still have run it/);
		});

		it('says nothing of the kind for a read', async () => {
			fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
			const error = await failure(elevenLabsJson('/v1/user', KEY));
			expect(error.message).not.toContain('may still have run');
		});

		it('names a timeout', async () => {
			const timeout = new Error('timed out');
			timeout.name = 'TimeoutError';
			fetchMock.mockRejectedValueOnce(timeout);
			await expect(
				elevenLabsBinary('/v1/music', KEY, {
					method: 'POST',
					timeoutMs: 300_000,
				}),
			).rejects.toThrow(/timed out after 300 s/);
		});

		it('warns when the transfer breaks after the answer began', async () => {
			const broken = new Response('x', { status: 200 });
			jest
				.spyOn(broken, 'arrayBuffer')
				.mockRejectedValueOnce(new Error('socket hang up'));
			fetchMock.mockResolvedValueOnce(broken);
			await expect(
				elevenLabsBinary('/v1/music', KEY, { method: 'POST' }),
			).rejects.toThrow(/may have been billed/);
		});
	});
});

describe('elevenLabsBinary', () => {
	it('returns bytes with the headers that matter', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1, 2, 3]), {
				status: 200,
				headers: {
					'content-type': 'audio/mpeg',
					'request-id': 'req_1',
					'x-trace-id': 'trace_1',
					'character-cost': '12',
					'history-item-id': 'hist_1',
					'song-id': 'song_1',
				},
			}),
		);
		const fetched = await elevenLabsBinary('/v1/x', KEY);
		expect([...fetched.bytes]).toEqual([1, 2, 3]);
		expect(fetched).toMatchObject({
			contentType: 'audio/mpeg',
			requestId: 'req_1',
			traceId: 'trace_1',
			characterCost: 12,
			historyItemId: 'hist_1',
			songId: 'song_1',
		});
	});

	it('leaves a missing cost undefined, not zero', async () => {
		fetchMock.mockResolvedValueOnce(new Response(new Uint8Array([1])));
		const fetched = await elevenLabsBinary('/v1/x', KEY);
		expect(fetched.characterCost).toBeUndefined();
	});
});

describe('toBinaryResult', () => {
	const fetched = (size: number, historyItemId?: string) => ({
		bytes: Buffer.alloc(size, 7),
		contentType: 'audio/mpeg',
		historyItemId,
	});

	it('returns base64 and the size by default', () => {
		const result = toBinaryResult(fetched(3, 'hist_1'));
		expect(result).toMatchObject({
			contentBase64: 'BwcH',
			byteLength: 3,
			contentType: 'audio/mpeg',
			historyItemId: 'hist_1',
		});
		expect('contentOmitted' in result).toBe(false);
		expect('bytes' in result).toBe(false);
	});

	it('leaves it out when asked, naming the history item', () => {
		const result = toBinaryResult(fetched(3, 'hist_1'), {
			includeContent: false,
		});
		expect(result).toMatchObject({
			byteLength: 3,
			contentOmitted: 'not_requested',
		});
		expect('contentBase64' in result).toBe(false);
		expect((result as { note: string }).note).toContain('hist_1');
	});

	it('leaves it out over the default limit, and says so', () => {
		const result = toBinaryResult(
			fetched(DEFAULT_MAX_CONTENT_BYTES + 1, 'hist_1'),
		);
		expect(result).toMatchObject({ contentOmitted: 'over_limit' });
		expect('contentBase64' in result).toBe(false);
		expect((result as { note: string }).note).toMatch(/history\.getAudio/);
	});

	it('lets maxBytes raise the limit', () => {
		const result = toBinaryResult(
			fetched(DEFAULT_MAX_CONTENT_BYTES + 1, 'hist_1'),
			{ maxBytes: DEFAULT_MAX_CONTENT_BYTES + 1 },
		);
		expect('contentBase64' in result).toBe(true);
	});

	it('fits the 1 MB script limit at the default limit', () => {
		const result = toBinaryResult(fetched(DEFAULT_MAX_CONTENT_BYTES, 'hist_1'));
		expect(JSON.stringify(result).length).toBeLessThan(1_000_000);
	});

	it('never drops audio that cannot be fetched again', () => {
		const result = toBinaryResult(fetched(DEFAULT_MAX_CONTENT_BYTES + 1), {
			includeContent: false,
			maxBytes: 10,
		});
		expect('contentBase64' in result).toBe(true);
		expect('contentOmitted' in result).toBe(false);
	});

	const oversized = (historyItemId?: string) => ({
		contentType: 'audio/mpeg',
		historyItemId,
		bytes: { byteLength: HARD_MAX_CONTENT_BYTES + 1 } as Buffer,
	});

	it('says plainly past the hard limit that a copy doesn’t exist', () => {
		const over = toBinaryResult(oversized());
		expect(over).toMatchObject({ contentOmitted: 'over_limit' });
		expect((over as { note: string }).note).toMatch(
			/keeps no copy of this output, so it can't be fetched again/,
		);
	});

	it('points at the direct download past the hard limit, not a maxBytes the schema rejects', () => {
		const history = toBinaryResult(oversized('hist/1'));
		const note = (history as { note: string }).note;
		expect(note).toContain(
			'GET https://api.elevenlabs.io/v1/history/hist%2F1/audio',
		);
		expect(note).not.toContain('maxBytes');

		const dub = toBinaryResult(oversized(), {
			refetchable: true,
			downloadPath: '/v1/dubbing/d1/audio/es',
		});
		expect((dub as { note: string }).note).toContain(
			'GET https://api.elevenlabs.io/v1/dubbing/d1/audio/es',
		);
	});

	it('suggests a maxBytes only when the schema would take it', () => {
		const result = toBinaryResult(fetched(50, 'hist_1'), { maxBytes: 10 });
		expect((result as { note: string }).note).toContain('maxBytes: 50');
	});

	it('treats a read as refetchable with no history id', () => {
		const result = toBinaryResult(fetched(50), {
			refetchable: true,
			maxBytes: 10,
		});
		expect(result).toMatchObject({ contentOmitted: 'over_limit' });
	});
});

describe('inputs', () => {
	it('encodes ids and refuses dot segments', () => {
		expect(pathId('a/b c')).toBe('a%2Fb%20c');
		expect(() => pathId('..')).toThrow(ElevenLabsRequestError);
		expect(() => pathId('.')).toThrow(ElevenLabsRequestError);
	});

	it('decodes base64 in its forms', () => {
		expect(decodeBase64('YWJj').toString()).toBe('abc');
		expect(decodeBase64('YWI').toString()).toBe('ab');
		expect(decodeBase64('data:audio/mpeg;base64,YWJj').toString()).toBe('abc');
		expect(decodeBase64('Pz8_').toString('hex')).toBe('3f3f3f');
	});

	it('refuses bad base64 instead of uploading less', () => {
		expect(() => decodeBase64('YWJjA')).toThrow(/not valid base64/);
		expect(() => decodeBase64('YW=J')).toThrow(/not valid base64/);
		expect(() => decodeBase64('!!!!')).toThrow(/not valid base64/);
		expect(() => decodeBase64('====')).toThrow(/not valid base64|empty/);
	});

	it('refuses a file over the limit before decoding it', () => {
		expect(() => decodeBase64('A'.repeat(140 * 1024 * 1024))).toThrow(
			/the limit here is/,
		);
	});

	it('measures base64 without decoding', () => {
		expect(base64ByteLength('YWJj')).toBe(3);
		expect(base64ByteLength('YWI=')).toBe(2);
		expect(base64ByteLength('YQ==')).toBe(1);
		expect(base64ByteLength('')).toBe(0);
	});

	it.each([
		['mp3_44100_128', 'audio/mpeg'],
		['pcm_16000', 'audio/pcm'],
		['ulaw_8000', 'audio/basic'],
		['alaw_8000', 'audio/alaw'],
		['opus_48000_128', 'audio/opus'],
		['wav_44100', 'audio/wav'],
		[undefined, 'audio/mpeg'],
		['flac_1', 'application/octet-stream'],
	])('names the type of %s', (format, type) => {
		expect(contentTypeOfOutputFormat(format)).toBe(type);
	});
});
