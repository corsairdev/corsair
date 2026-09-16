import { createCloudProxy } from '../cloud-proxy';

const KEY = 'ck_cloud_test';
const UPSTREAM = 'https://acme-vm.corsair.cloud/acme/api/corsair';

function mockFetch(status: number, body: string, contentType = 'application/json') {
	return jest.fn().mockResolvedValue(
		new Response(body, { status, headers: { 'content-type': contentType } }),
	);
}

describe('createCloudProxy', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('builds the upstream URL by stripping basePath and forwarding path + search', async () => {
		const fetchMock = mockFetch(200, '{}');
		global.fetch = fetchMock as unknown as typeof fetch;

		const proxy = createCloudProxy({ apiKey: KEY, url: UPSTREAM });
		await proxy(
			new Request(
				'https://app.example.com/api/corsair/acme/notion/call/pages.searchPage?x=1',
				{ method: 'POST', body: '{"args":{}}', headers: { 'content-type': 'application/json' } },
			),
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [target] = fetchMock.mock.calls[0]!;
		expect(target).toBe(
			`${UPSTREAM}/acme/notion/call/pages.searchPage?x=1`,
		);
	});

	it('injects Authorization: Bearer <apiKey>', async () => {
		const fetchMock = mockFetch(200, '{}');
		global.fetch = fetchMock as unknown as typeof fetch;

		const proxy = createCloudProxy({ apiKey: KEY, url: UPSTREAM });
		await proxy(
			new Request('https://app.example.com/api/corsair/acme/notion/call/pages.searchPage', {
				method: 'POST',
				body: '{}',
			}),
		);

		const [, init] = fetchMock.mock.calls[0]!;
		const headers = new Headers((init as RequestInit).headers);
		expect(headers.get('authorization')).toBe(`Bearer ${KEY}`);
	});

	it('does not forward the client-sent Authorization or cookie headers', async () => {
		const fetchMock = mockFetch(200, '{}');
		global.fetch = fetchMock as unknown as typeof fetch;

		const proxy = createCloudProxy({ apiKey: KEY, url: UPSTREAM });
		await proxy(
			new Request('https://app.example.com/api/corsair/acme/notion/call/pages.searchPage', {
				method: 'POST',
				body: '{}',
				headers: {
					authorization: 'Bearer client-supplied-token',
					cookie: 'session=abc123',
				},
			}),
		);

		const [, init] = fetchMock.mock.calls[0]!;
		const headers = new Headers((init as RequestInit).headers);
		expect(headers.get('authorization')).toBe(`Bearer ${KEY}`);
		expect(headers.has('cookie')).toBe(false);
	});

	it('returns the upstream status and body', async () => {
		const fetchMock = mockFetch(404, '{"error":"not_found"}');
		global.fetch = fetchMock as unknown as typeof fetch;

		const proxy = createCloudProxy({ apiKey: KEY, url: UPSTREAM });
		const res = await proxy(
			new Request('https://app.example.com/api/corsair/acme/notion/call/pages.searchPage', {
				method: 'POST',
				body: '{}',
			}),
		);

		expect(res.status).toBe(404);
		expect(await res.text()).toBe('{"error":"not_found"}');
		expect(res.headers.get('content-type')).toBe('application/json');
	});
});
