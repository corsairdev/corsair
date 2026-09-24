import { AuthMissingError, createCorsair } from 'corsair/core';
import { remoet } from './index';

// End-to-end through the assembled plugin: createCorsair binds the endpoints,
// the keyBuilder, the error handlers and the real core HTTP transport. Only
// the network is mocked, at global fetch.

type MockReply = {
	status: number;
	body: object;
	headers?: Record<string, string>;
};

function reply({ status, body, headers = {} }: MockReply): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();

const perMinuteLimit: MockReply = {
	status: 429,
	body: {
		statusCode: 429,
		message: 'Rate limit exceeded',
		error: 'Too Many Requests',
	},
	headers: {
		'x-ratelimit-limit': '60',
		'x-ratelimit-remaining': '0',
		'x-ratelimit-reset': '42',
	},
};

const dailyCapMessage =
	'Daily API request limit reached (500/day). This is an abuse threshold, not a product gate: if you are hitting it legitimately, get in touch.';

const dailyCap: MockReply = {
	status: 429,
	body: { statusCode: 429, message: dailyCapMessage, limit: 500 },
};

const links = {
	url: null,
	githubUrl: 'https://github.com/example',
	facebookUrl: null,
	twitterUrl: null,
	linkedinUrl: null,
	youtubeUrl: null,
};

function client(key?: string) {
	return createCorsair({ plugins: [remoet(key ? { key } : {})] });
}

describe('Remoet plugin through createCorsair', () => {
	const realFetch = global.fetch;

	beforeEach(() => {
		fetchMock.mockReset();
		global.fetch = fetchMock;
		// Without a database the core logs "Failed to log event" and retry
		// notices; they are expected here and only add noise.
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		jest.spyOn(console, 'log').mockImplementation(() => undefined);
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
		global.fetch = realFetch;
	});

	it('calls Remoet with the configured key', async () => {
		fetchMock.mockResolvedValueOnce(reply({ status: 200, body: links }));

		const result = await client('test-key').remoet.api.profile.getLinks({});

		expect(result.githubUrl).toBe('https://github.com/example');
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(String(url)).toBe('https://api.remoet.dev/user/links');
		expect(new Headers(init?.headers).get('authorization')).toBe(
			'Bearer test-key',
		);
	});

	it('throws AuthMissingError when no key is available', async () => {
		await expect(
			client().remoet.api.profile.getLinks({}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('retries a per-minute 429 after the X-RateLimit-Reset delay', async () => {
		jest.useFakeTimers();
		fetchMock
			.mockResolvedValueOnce(reply(perMinuteLimit))
			.mockResolvedValueOnce(reply({ status: 200, body: links }));

		const pending = client('test-key').remoet.api.profile.getLinks({});

		await jest.advanceTimersByTimeAsync(41_000);
		expect(fetchMock).toHaveBeenCalledTimes(1);

		await jest.advanceTimersByTimeAsync(1_000);
		await expect(pending).resolves.toMatchObject({
			githubUrl: 'https://github.com/example',
		});
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('does not retry the daily cap and surfaces its message', async () => {
		fetchMock.mockResolvedValue(reply(dailyCap));

		await expect(
			client('test-key').remoet.api.profile.getLinks({}),
		).rejects.toMatchObject({ status: 429, message: dailyCapMessage });
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("carries Remoet's error text instead of the transport status text", async () => {
		fetchMock.mockResolvedValueOnce(
			reply({
				status: 404,
				body: {
					message: 'Link tree not found',
					error: 'Not Found',
					statusCode: 404,
				},
			}),
		);

		await expect(
			client('test-key').remoet.api.linkTrees.get({ slug: 'missing' }),
		).rejects.toThrow('Link tree not found');
	});
});
