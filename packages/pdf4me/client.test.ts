import {
	describePdf4meError,
	makePdf4meRequest,
	Pdf4meAPIError,
} from './client';

const API_KEY = 'pdf4me-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON, binary or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(
			typeof body === 'string'
				? body
				: body instanceof Uint8Array
					? (body as unknown as Blob) // unknown: a binary BodyInit has no shared narrower type
					: JSON.stringify(body),
			{
				status,
				headers: {
					'Content-Type':
						typeof body === 'string' || body instanceof Uint8Array
							? 'application/pdf'
							: 'application/json',
					...headers,
				},
			},
		),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<Pdf4meAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(Pdf4meAPIError);
	if (!(error instanceof Pdf4meAPIError)) throw error;
	return error;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makePdf4meRequest', () => {
	it('authenticates with the raw key in the Authorization header, no scheme word', async () => {
		respond({ ok: true }, 200);

		await makePdf4meRequest(API_KEY, {
			method: 'POST',
			path: '/api/v2/Optimize',
			body: { docContent: 'x' },
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.pdf4me.com/api/v2/Optimize');
		expect(sent.headers.get('authorization')).toBe(API_KEY);
		expect(sent.headers.get('authorization')).not.toContain('Bearer');
	});

	it('reads a binary answer as the file bytes', async () => {
		respond(new Uint8Array([0x25, 0x50]), 200);

		const result = (await makePdf4meRequest(API_KEY, {
			method: 'POST',
			path: '/api/v2/Merge',
			body: { docContent: ['x'] },
			binary: true,
		})) as { bytes: Uint8Array; contentType: string | null };
		expect(result.bytes).toBeInstanceOf(Uint8Array);
		expect(result.contentType).toContain('pdf');
	});

	it('keeps the status and message on the rebuilt error', async () => {
		respond({ message: 'File is empty' }, 400);

		const error = await failure(
			makePdf4meRequest(API_KEY, {
				method: 'POST',
				path: '/api/v2/Optimize',
				body: { docContent: '' },
			}),
		);
		expect(error.status).toBe(400);
		expect(error.message).toContain('File is empty');
		expect(error.name).toBe('Pdf4meAPIError');
	});

	it('falls back to the status text for a plain-text error body', async () => {
		respond('Not Found', 404);

		const error = await failure(
			makePdf4meRequest(API_KEY, { method: 'POST', path: '/api/v2/Nope' }),
		);
		expect(error.status).toBe(404);
		expect(error.message).toContain('Not Found');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePdf4meRequest(API_KEY, { method: 'POST', path: '/api/v2/Optimize' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });
		respond({ ok: true }, 200);

		const result = await makePdf4meRequest(API_KEY, {
			method: 'POST',
			path: '/api/v2/Optimize',
		});
		expect(result).toEqual({ ok: true });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePdf4meError', () => {
	it('reads a JSON message body', () => {
		expect(describePdf4meError({ message: 'File is empty' }, 'fallback')).toBe(
			'File is empty',
		);
	});

	it('reads a plain-text body', () => {
		expect(
			describePdf4meError('Invalid Optimization Profile', 'fallback'),
		).toBe('Invalid Optimization Profile');
	});

	it('falls back on anything else', () => {
		expect(describePdf4meError(null, 'fallback')).toBe('fallback');
	});
});
