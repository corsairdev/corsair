import { AuthMissingError, createCorsair } from 'corsair/core';
import { remoet, remoetEndpointSchemas } from './index';

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

	it('sends every jobs.search list as repeated keys, commas intact', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({
				status: 200,
				body: {
					jobs: [],
					totalCount: 0,
					page: 1,
					pageSize: 20,
					totalPages: 0,
					hasNextPage: false,
				},
			}),
		);

		await client('test-key').remoet.api.jobs.search({
			techStack: ['Go', 'Rust'],
			remotePolicy: ['remote', 'hybrid'],
			experienceLevel: ['senior'],
			location: ['Portland, OR', 'Germany'],
			pageSize: 20,
		});

		const [url] = fetchMock.mock.calls[0] ?? [];
		const params = new URL(String(url)).searchParams;
		expect(params.getAll('techStack')).toEqual(['Go', 'Rust']);
		expect(params.getAll('remotePolicy')).toEqual(['remote', 'hybrid']);
		expect(params.getAll('experienceLevel')).toEqual(['senior']);
		expect(params.getAll('location')).toEqual(['Portland, OR', 'Germany']);
		expect(params.get('pageSize')).toBe('20');
		expect([...params.keys()].some((key) => key.includes('['))).toBe(false);
		expect(String(url)).toContain('location=Portland%2C%20OR&location=Germany');

		fetchMock.mockResolvedValueOnce(
			reply({
				status: 200,
				body: {
					jobs: [],
					totalCount: 0,
					page: 1,
					pageSize: 20,
					totalPages: 0,
					hasNextPage: false,
				},
			}),
		);
		await client('test-key').remoet.api.jobs.search({ techStack: [] });
		const [emptyUrl] = fetchMock.mock.calls[1] ?? [];
		expect(String(emptyUrl)).toBe('https://api.remoet.dev/user/job-postings');
	});

	it('sends DELETE for stars.delete and does not retry a 409', async () => {
		const message =
			'You have used all 5 unstar operations for this period. Your budget resets on 2026-10-20T00:00:00.000Z.';
		fetchMock.mockResolvedValue(
			reply({
				status: 409,
				body: { message, error: 'Conflict', statusCode: 409 },
			}),
		);

		await expect(
			client('test-key').remoet.api.stars.delete({ companySlug: 'starburst' }),
		).rejects.toMatchObject({ status: 409, message });
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(String(url)).toBe('https://api.remoet.dev/user/stars/starburst');
		expect(init?.method).toBe('DELETE');
	});

	it('marks every write as write-risk, every delete as destructive', () => {
		const { endpointMeta } = remoet({});
		if (!endpointMeta) throw new Error('remoet plugin has no endpointMeta');

		expect(endpointMeta['profile.update']?.riskLevel).toBe('write');
		expect(endpointMeta['feed.list']?.riskLevel).toBe('read');

		for (const group of ['workExperience', 'projects', 'education'] as const) {
			expect(endpointMeta[`${group}.list`]?.riskLevel).toBe('read');
			expect(endpointMeta[`${group}.create`]?.riskLevel).toBe('write');
			expect(endpointMeta[`${group}.update`]?.riskLevel).toBe('write');
			expect(endpointMeta[`${group}.delete`]?.riskLevel).toBe('destructive');
			// A destructive op's description tells the agent to confirm first.
			expect(endpointMeta[`${group}.delete`]?.description).toMatch(/confirm/i);
		}
	});

	it('marks every hard delete irreversible, with "Permanently remove" in its description', () => {
		const { endpointMeta } = remoet({});
		if (!endpointMeta) throw new Error('remoet plugin has no endpointMeta');

		for (const op of [
			'workExperience.delete',
			'projects.delete',
			'education.delete',
			'savedJobs.delete',
		] as const) {
			expect(endpointMeta[op]?.irreversible).toBe(true);
			expect(endpointMeta[op]?.description).toMatch(/^Permanently remove/);
		}

		// stars.delete only spends a budget; it does not destroy stored data.
		expect(endpointMeta['stars.delete']?.irreversible).toBeUndefined();
	});

	it('gives every endpoint a valid riskLevel and a non-empty description', () => {
		const { endpointMeta } = remoet({});
		if (!endpointMeta) throw new Error('remoet plugin has no endpointMeta');

		const entries = Object.entries(endpointMeta) as Array<
			[
				string,
				{ riskLevel: string; description?: string; irreversible?: boolean },
			]
		>;
		expect(entries.length).toBeGreaterThan(0);

		for (const [path, meta] of entries) {
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
			expect(meta.description?.length ?? 0).toBeGreaterThan(0);
			if (meta.riskLevel !== 'destructive') {
				expect(meta.irreversible).toBeUndefined();
			}
			// Every op id round-trips through the plugin's own schema map.
			expect(Object.keys(remoetEndpointSchemas)).toContain(path);
		}
	});
});
