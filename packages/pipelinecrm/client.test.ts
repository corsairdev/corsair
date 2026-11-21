import {
	describePipelineCrmError,
	makePipelineCrmRequest,
	PipelineCrmAPIError,
} from './client';
import { unknownApiKey } from './test-fixtures';

const TOKEN = 'pcrm_live_testtoken';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status: number) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(
	promise: Promise<unknown>,
): Promise<PipelineCrmAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(PipelineCrmAPIError);
	if (!(error instanceof PipelineCrmAPIError)) throw error;
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

describe('makePipelineCrmRequest', () => {
	it('authenticates as a Bearer token under /api/v3', async () => {
		respond({ entries: [], pagination: {} }, 200);

		await makePipelineCrmRequest(TOKEN, {
			method: 'GET',
			path: '/api/v3/deals',
			query: { page: 2 },
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.pipelinecrm.com/api/v3/deals?page=2');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${TOKEN}`);
	});

	it('sends wrapped JSON bodies with the media type on writes', async () => {
		respond({ id: 1 }, 200);

		await makePipelineCrmRequest(TOKEN, {
			method: 'POST',
			path: '/api/v3/deals',
			body: { deal: { name: 'New deal' } },
		});

		const sent = lastCall();
		expect(sent.init.body).toBe(JSON.stringify({ deal: { name: 'New deal' } }));
		expect(sent.headers.get('content-type')).toContain('application/json');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unknownApiKey, 401);

		const error = await failure(
			makePipelineCrmRequest(TOKEN, { method: 'GET', path: '/api/v3/deals' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Pipeline CRM 401: Unknown api_key');
		expect(error.method).toBe('GET');
	});

	it('drops the request body from the rebuilt error', async () => {
		respond(unknownApiKey, 401);

		const error = await failure(
			makePipelineCrmRequest(TOKEN, {
				method: 'POST',
				path: '/api/v3/people',
				body: { person: { email: 'secret@acme.com' } },
			}),
		);
		const printed = JSON.stringify(error.request);
		expect(printed).not.toContain('secret@acme.com');
	});
});

describe('describePipelineCrmError', () => {
	it('extracts the documented error field', () => {
		expect(describePipelineCrmError(unknownApiKey, 'fallback')).toBe(
			'Unknown api_key',
		);
	});

	it('falls back on unknown bodies', () => {
		expect(describePipelineCrmError(null, 'fallback')).toBe('fallback');
	});
});
