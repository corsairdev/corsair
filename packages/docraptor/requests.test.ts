import { logEventFromContext } from 'corsair/core';
import { Documents, Ips } from './endpoints';
import {
	asyncCreated,
	completedStatus,
	documentListRow,
	hostedDoc,
	ips,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const API_KEY = 'dr-requests-test-key';
const AUTH_HEADER = `Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`;

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant, so the shared return stays unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: inputs arrive pre-validated only inside the endpoint, so the test
// passes raw caller values.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status = 200) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticatedAt(origin: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe(origin);
	expect(sent.headers.get('authorization')).toBe(AUTH_HEADER);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('documents.createAsync', () => {
	it('POSTs the document JSON to /async_docs', async () => {
		respond(asyncCreated);

		const input = {
			type: 'pdf' as const,
			name: 'probe',
			document_content: '<html><body>hi</body></html>',
			test: true,
		};
		const result = await invoke(Documents.createAsync, input);

		expectAuthenticatedAt('https://api.docraptor.com');
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/async_docs',
			query: {},
		});
		expect(lastRequest().body).toEqual(input);
		expect(result).toEqual(asyncCreated);
	});
});

describe('documents.createHostedAsync', () => {
	it('POSTs the hosted document JSON to /hosted_async_docs', async () => {
		respond(asyncCreated);

		const input = {
			type: 'pdf' as const,
			document_url: 'https://example.com/report.html',
			hosted_download_limit: 5,
			hosted_expires_at: '2027-01-23T08:02:30-05:00' as const,
		};
		const result = await invoke(Documents.createHostedAsync, input);

		expectAuthenticatedAt('https://api.docraptor.com');
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/hosted_async_docs',
		});
		expect(lastRequest().body).toEqual(input);
		expect(result).toEqual(asyncCreated);
	});
});

describe('documents.createHosted', () => {
	it('POSTs to /hosted_docs and returns the public URL fields', async () => {
		respond(hostedDoc);

		const result = await invoke(Documents.createHosted, {
			type: 'pdf' as const,
			document_content: '<html><body>hosted</body></html>',
			hosted_download_limit: 3,
		});

		expectAuthenticatedAt('https://api.docraptor.com');
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/hosted_docs',
		});
		expect(lastRequest().body).toMatchObject({
			type: 'pdf',
			document_content: '<html><body>hosted</body></html>',
			hosted_download_limit: 3,
		});
		expect(result).toEqual(hostedDoc);
	});
});

describe('documents.status', () => {
	it('GETs /status/{id} with the status id in the path', async () => {
		respond(completedStatus);

		const result = await invoke(Documents.status, {
			statusId: 'abc-123',
		});

		expectAuthenticatedAt('https://api.docraptor.com');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/status/abc-123',
			query: {},
		});
		expect(result).toEqual(completedStatus);
	});

	it('percent-encodes the status id', async () => {
		respond(completedStatus);

		await invoke(Documents.status, { statusId: 'a/b' });

		expect(lastRequest().path).toBe('/status/a%2Fb');
	});
});

describe('documents.list', () => {
	it('GETs /docs.json with page and per_page', async () => {
		respond([documentListRow]);

		const result = await invoke(Documents.list, { page: 2, per_page: 50 });

		expectAuthenticatedAt('https://api.docraptor.com');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/docs.json',
			query: { page: '2', per_page: '50' },
		});
		expect(result).toEqual({
			documents: [documentListRow],
			page: 2,
			per_page: 50,
			next_page: null,
		});
	});

	it('defaults to page 1 and a 100-per-page cap', async () => {
		respond(Array.from({ length: 100 }, () => documentListRow));

		const result = (await invoke(Documents.list, {})) as {
			per_page: number;
			next_page: number | null;
		};

		expect(lastRequest().query).toEqual({ page: '1', per_page: undefined });
		expect(result.per_page).toBe(100);
		expect(result.next_page).toBe(2);
	});
});

describe('documents.expire', () => {
	it('PATCHes /expire/{id}.json and reports success on the empty 200', async () => {
		respondEmpty(200);

		const result = await invoke(Documents.expire, {
			downloadId: '123-456-abc',
		});

		expectAuthenticatedAt('https://api.docraptor.com');
		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/expire/123-456-abc.json',
			query: {},
		});
		expect(result).toEqual({ success: true });
	});
});

describe('ips.list', () => {
	it('GETs /ips.json on docraptor.com and returns the bare array', async () => {
		respond(ips);

		const result = await invoke(Ips.list, {});

		expectAuthenticatedAt('https://docraptor.com');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/ips.json',
			query: {},
		});
		expect(result).toEqual({ ips });
	});
});

describe('logging', () => {
	it('does not log document content', async () => {
		respond(asyncCreated);
		const mockLog = jest.mocked(logEventFromContext);

		await invoke(Documents.createAsync, {
			type: 'pdf' as const,
			document_content: '<html>secret</html>',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'docraptor.documents.createAsync',
			{ statusId: asyncCreated.status_id, type: 'pdf', test: true },
			'completed',
		);
		mockLog.mockClear();
	});
});
