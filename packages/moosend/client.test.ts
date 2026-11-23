import { MoosendAPIError, makeMoosendRequest } from './client';
import { invalidKeyEnvelope, mailingList } from './test-fixtures';

const API_KEY = 'moosend-key-123';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or HTML.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, {
			status,
			headers: { 'Content-Type': contentType },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeMoosendRequest', () => {
	it('sends the key as the apikey query parameter', async () => {
		respond({ Code: 0, Error: null, Context: [mailingList] });

		await makeMoosendRequest(API_KEY, {
			method: 'GET',
			path: '/lists.json',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const parsed = new URL(url);
		expect(parsed.origin).toBe('https://api.moosend.com');
		expect(parsed.pathname).toBe('/v3/lists.json');
		expect(parsed.searchParams.get('apikey')).toBe(API_KEY);
		// The key must not ride in a header instead.
		expect(new Headers(init.headers).get('authorization')).toBeNull();
	});

	it('returns the Context of a success envelope', async () => {
		respond({ Code: 0, Error: null, Context: [mailingList] });

		await expect(
			makeMoosendRequest(API_KEY, {
				method: 'GET',
				path: '/lists.json',
				replayable: true,
			}),
		).resolves.toEqual([mailingList]);
	});

	it('throws from a 200 body whose Code is nonzero', async () => {
		respond(invalidKeyEnvelope);

		const error = await makeMoosendRequest(API_KEY, {
			method: 'GET',
			path: '/lists.json',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoosendAPIError);
		expect(error).toMatchObject({
			code: 104,
			moosendError: 'API_KEY_NOT_VALID',
			replayable: true,
		});
		expect((error as MoosendAPIError).message).toContain('API_KEY_NOT_VALID');
	});

	it('never prints the key in the error message or JSON', async () => {
		respond(invalidKeyEnvelope);

		const error = await makeMoosendRequest('super-secret-key', {
			method: 'GET',
			path: '/lists.json',
		}).catch((caught: unknown) => caught);

		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain('super-secret-key');
	});

	it('carries a gateway 404 status without the query string', async () => {
		respond('<html>404</html>', 404, 'text/html');

		const error = await makeMoosendRequest(API_KEY, {
			method: 'GET',
			path: '/nope.json',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoosendAPIError);
		expect(error).toMatchObject({ status: 404, replayable: true });
		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain(API_KEY);
	});

	it('wraps a transport failure with the replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeMoosendRequest(API_KEY, {
			method: 'GET',
			path: '/lists.json',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoosendAPIError);
		expect(error).toMatchObject({ replayable: true, status: undefined });
	});

	it('fails loudly when the answer is not a Code envelope', async () => {
		respond({ something: 'else' });

		const error = await makeMoosendRequest(API_KEY, {
			method: 'GET',
			path: '/lists.json',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoosendAPIError);
		expect((error as MoosendAPIError).message).toContain('Code envelope');
	});
});
