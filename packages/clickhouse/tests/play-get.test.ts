import { Play } from '../endpoints';
import { ClickhouseEndpointOutputSchemas } from '../endpoints/types';

const originalFetch = globalThis.fetch;

type FetchCall = [unknown, RequestInit | undefined];

afterEach(() => {
	globalThis.fetch = originalFetch;
	jest.restoreAllMocks();
});

function makeCtx(opts: { baseUrl?: string; key: string }) {
	return {
		key: opts.key,
		options: { authType: 'api_key' as const, baseUrl: opts.baseUrl },
		$getAccountId: async () => null,
		db: undefined,
	};
}

describe('Play.get', () => {
	it('fetches /play and returns the HTML', async () => {
		const html = '<html><body>ClickHouse Play</body></html>';
		const fetchSpy = jest.fn<
			Promise<{
				ok: boolean;
				status: number;
				statusText: string;
				headers: Headers;
				text: () => Promise<string>;
			}>,
			FetchCall
		>(async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'content-length': String(html.length) }),
			text: async () => html,
		}));
		globalThis.fetch = fetchSpy as unknown as typeof fetch;

		const result = await Play.get(
			makeCtx({
				baseUrl: 'https://ch.example.com',
				key: 'Basic AAA=',
			}) as never,
			{},
		);

		const parsed =
			ClickhouseEndpointOutputSchemas.getPlayInterface.parse(result);
		expect(parsed.url).toBe('https://ch.example.com/play');
		expect(parsed.html).toBe(html);
		expect(parsed.sizeBytes).toBe(html.length);
	});

	it('strips a trailing slash before appending /play', async () => {
		const fetchSpy = jest.fn<
			Promise<{
				ok: boolean;
				status: number;
				statusText: string;
				headers: Headers;
				text: () => Promise<string>;
			}>,
			FetchCall
		>(async () => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'content-length': '5' }),
			text: async () => '<html/>',
		}));
		globalThis.fetch = fetchSpy as unknown as typeof fetch;

		await Play.get(
			makeCtx({
				baseUrl: 'https://ch.example.com/',
				key: 'Basic AAA=',
			}) as never,
			{},
		);

		const call = fetchSpy.mock.calls[0] as FetchCall;
		expect(call[0]).toBe('https://ch.example.com/play');
	});

	it('throws ClickhouseAPIError on a 4xx response', async () => {
		globalThis.fetch = jest.fn(
			async () =>
				({
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					headers: new Headers(),
					text: async () => '',
				}) as unknown as Response,
		) as unknown as typeof fetch;

		await expect(
			Play.get(
				makeCtx({
					baseUrl: 'https://ch.example.com',
					key: 'Basic bad',
				}) as never,
				{},
			),
		).rejects.toThrow();
	});
});
