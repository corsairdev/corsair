import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	BuildkiteAPIError,
	BuildkiteRateLimitError,
	makeBuildkiteRequest,
} from './client';
import { getCurrentAccessToken } from './endpoints/get-current-access-token';
import { getMeta } from './endpoints/get-meta';
import { getUser } from './endpoints/get-user';
import { listOrganizations } from './endpoints/list-organizations';
import { listPipelineAgents } from './endpoints/list-pipeline-agents';
import {
	BuildkiteEndpointInputSchemas,
	BuildkiteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { buildkite } from './index';
import {
	BuildkiteAccessToken,
	BuildkiteAgent,
	BuildkiteMeta,
	BuildkiteOrganization,
	BuildkiteUser,
} from './schema';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string>),
		},
	});
}

function lastRequest(): { url: string; auth: string | null; method: string } {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string,
		RequestInit | undefined,
	];
	const headers = new Headers(init?.headers);
	return {
		url: input,
		auth: headers.get('Authorization'),
		method: init?.method ?? 'GET',
	};
}

const TEST_KEY = 'test-key';

const ctx = {
	key: TEST_KEY,
	$getAccountId: async () => 'test-account',
} as never;

const tokenFixture = {
	uuid: 'b63254c0-3271-4a98-8270-7cfbd6c2f14e',
	scopes: ['read_build'],
	description: 'Development Token',
	created_at: '2025-07-16 06:07:42 UTC',
	expires_at: '2025-07-23 06:07:42 UTC',
	user: { email: 'algernon.m@buildkite.com', name: 'Algernon Moncrieff' },
};

const metaFixture = { webhook_ips: ['192.0.2.0/24', '198.51.100.12'] };

const userFixture = {
	id: 'abc123-4567-8910',
	graphql_id: 'gql-user',
	name: 'John Smith',
	email: 'john.smith@example.com',
	avatar_url: 'https://www.gravatar.com/avatar/abc123',
	created_at: '2012-03-04T56:07:08.910Z',
};

const orgFixture = {
	id: 'bb3125de-4dc9-44cf-ad18-65d2b71a5a34',
	graphql_id: 'gql-org',
	url: 'https://api.buildkite.com/v2/organizations/my-great-org',
	web_url: 'https://buildkite.com/my-great-org',
	name: 'My Great Org',
	slug: 'my-great-org',
	pipelines_url:
		'https://api.buildkite.com/v2/organizations/my-great-org/pipelines',
	agents_url: 'https://api.buildkite.com/v2/organizations/my-great-org/agents',
	emojis_url: 'https://api.buildkite.com/v2/organizations/my-great-org/emojis',
	created_at: '2015-05-09T21:05:59.874Z',
};

const agentFixture = {
	id: '0b461f65-e7be-4c80-888a-ef11d81fd971',
	graphql_id: 'gql-agent',
	url: 'https://api.buildkite.com/v2/organizations/my-great-org/agents/my-agent',
	web_url:
		'https://buildkite.com/organizations/my-great-org/clusters/78088c9a-6e72-4896-848d-e6f479f50c24/queues/c109939f-3b71-4cd3-b175-8eb79d2eb38e/agents/0b461f65-e7be-4c80-888a-ef11d81fd971',
	name: 'my-agent',
	connection_state: 'connected',
	hostname: 'some.server',
	ip_address: '144.132.19.12',
	user_agent: 'buildkite-agent/2.1.0 (linux; amd64)',
	version: '2.1.0',
	os_id: 'linux',
	arch: 'amd64',
	queue: 'default',
	creator: {
		id: '2eba97bc-7cc7-427f-8feb-1008c72aa1d8',
		name: 'Keith Pitt',
		email: 'me@keithpitt.com',
		avatar_url:
			'https://www.gravatar.com/avatar/e14f55d3f939977cecbf51b64ff6f861',
		created_at: '2015-05-09T21:05:59.874Z',
	},
	created_at: '2014-02-24T22:33:45.263Z',
	connected_at: '2014-02-24T22:33:45.263Z',
	disconnected_at: null,
	lost_at: null,
	stopped_at: null,
	job: {
		id: 'cd164055-9649-452b-8d8e-28fe67370a1e',
		graphql_id: 'gql-job',
		type: 'script',
		name: 'rspec',
		agent_query_rules: ['*'],
		state: 'passed',
		build_url:
			'https://api.buildkite.com/v2/organizations/my-great-org/pipelines/sleeper/builds/50',
		web_url:
			'https://buildkite.com/my-great-org/sleeper/builds/50#cd164055-9649-452b-8d8e-28fe67370a1e',
		log_url:
			'https://api.buildkite.com/v2/organizations/my-great-org/pipelines/sleeper/builds/50/jobs/cd164055-9649-452b-8d8e-28fe67370a1e/log',
		raw_log_url:
			'https://api.buildkite.com/v2/organizations/my-great-org/pipelines/sleeper/builds/50/jobs/cd164055-9649-452b-8d8e-28fe67370a1e/log.txt',
		artifacts_url:
			'https://api.buildkite.com/v2/organizations/my-great-org/pipelines/sleeper/builds/50/jobs/cd164055-9649-452b-8d8e-28fe67370a1e/artifacts',
		script_path: 'sleep 1',
		command: 'sleep 1',
		soft_failed: false,
		exit_status: 0,
		artifact_paths: '*',
		agent: null,
		created_at: '2015-07-30T12:58:22.942Z',
		scheduled_at: '2015-07-30T12:58:22.935Z',
		started_at: '2015-07-30T12:58:34.000Z',
		finished_at: '2015-07-30T12:58:37.000Z',
	},
	last_job_finished_at: null,
	priority: null,
	meta_data: ['key1=val1', 'key2=val2'],
};

describe('Buildkite plugin', () => {
	it('instantiates with api_key auth and five endpoints', () => {
		const plugin = buildkite();
		expect(plugin.id).toBe('buildkite');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(5);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = buildkite({ key: TEST_KEY });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).resolves.toBe(TEST_KEY);
	});

	it('resolves an empty key so getMeta can run without api_key', async () => {
		const plugin = buildkite();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).resolves.toBe('');
	});

	it('getMeta does not require a key', async () => {
		mockFetch.mockResolvedValue(jsonResponse(metaFixture));
		const result = await getMeta({ key: undefined } as never, {});
		expect(result.webhook_ips).toEqual(metaFixture.webhook_ips);
		expect(lastRequest().auth).toBeNull();
	});

	it('getUser requires a key', async () => {
		await expect(getUser({ key: '' } as never, {})).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('getCurrentAccessToken hits GET /v2/access-token', async () => {
		mockFetch.mockResolvedValue(jsonResponse(tokenFixture));
		const input = BuildkiteEndpointInputSchemas.getCurrentAccessToken.parse({});
		const result = await getCurrentAccessToken(ctx, input);
		expect(result.uuid).toBe(tokenFixture.uuid);
		BuildkiteEndpointOutputSchemas.getCurrentAccessToken.parse(result);
		const req = lastRequest();
		expect(req.url).toBe('https://api.buildkite.com/v2/access-token');
		expect(req.method).toBe('GET');
		expect(req.auth).toBe(`Bearer ${TEST_KEY}`);
	});

	it('getMeta hits unauthenticated GET /v2/meta', async () => {
		mockFetch.mockResolvedValue(jsonResponse(metaFixture));
		const input = BuildkiteEndpointInputSchemas.getMeta.parse({});
		const result = await getMeta(ctx, input);
		expect(result.webhook_ips).toEqual(metaFixture.webhook_ips);
		BuildkiteEndpointOutputSchemas.getMeta.parse(result);
		const req = lastRequest();
		expect(req.url).toBe('https://api.buildkite.com/v2/meta');
		expect(req.auth).toBeNull();
	});

	it('getUser hits GET /v2/user', async () => {
		mockFetch.mockResolvedValue(jsonResponse(userFixture));
		const input = BuildkiteEndpointInputSchemas.getUser.parse({});
		const result = await getUser(ctx, input);
		expect(result.email).toBe(userFixture.email);
		BuildkiteEndpointOutputSchemas.getUser.parse(result);
		expect(lastRequest().url).toBe('https://api.buildkite.com/v2/user');
	});

	it('listOrganizations pages with official query params', async () => {
		mockFetch.mockResolvedValue(jsonResponse([orgFixture]));
		const input = BuildkiteEndpointInputSchemas.listOrganizations.parse({
			page: 2,
			per_page: 30,
		});
		const result = await listOrganizations(ctx, input);
		expect(result[0]?.slug).toBe('my-great-org');
		BuildkiteEndpointOutputSchemas.listOrganizations.parse(result);
		const req = lastRequest();
		expect(req.url).toBe(
			'https://api.buildkite.com/v2/organizations?page=2&per_page=30',
		);
	});

	it('listPipelineAgents substitutes org slug and official filters', async () => {
		mockFetch.mockResolvedValue(jsonResponse([agentFixture]));
		const input = BuildkiteEndpointInputSchemas.listPipelineAgents.parse({
			orgSlug: 'my-great-org',
			name: 'ci-agent-1',
			hostname: 'ci-box-1',
			version: '2.1.0',
			cluster_queue_id: 'c109939f-3b71-4cd3-b175-8eb79d2eb38e',
			page: 1,
			per_page: 100,
		});
		const result = await listPipelineAgents(ctx, input);
		expect(result[0]?.connection_state).toBe('connected');
		BuildkiteEndpointOutputSchemas.listPipelineAgents.parse(result);
		const req = lastRequest();
		expect(
			req.url.startsWith(
				'https://api.buildkite.com/v2/organizations/my-great-org/agents?',
			),
		).toBe(true);
		expect(req.url).toContain('name=ci-agent-1');
		expect(req.url).toContain('hostname=ci-box-1');
		expect(req.url).toContain('version=2.1.0');
		expect(req.url).toContain(
			'cluster_queue_id=c109939f-3b71-4cd3-b175-8eb79d2eb38e',
		);
		expect(req.url).toContain('page=1');
		expect(req.url).toContain('per_page=100');
	});

	it('rejects org slugs that are not official slug characters', () => {
		expect(() =>
			BuildkiteEndpointInputSchemas.listPipelineAgents.parse({
				orgSlug: 'my org/prod',
			}),
		).toThrow();
		expect(() =>
			BuildkiteEndpointInputSchemas.listPipelineAgents.parse({
				orgSlug: '(aaaaaaaa',
			}),
		).toThrow();
	});
});

describe('Buildkite client errors', () => {
	it('wraps 429 as BuildkiteRateLimitError with retry metadata', async () => {
		mockFetch.mockImplementation(() =>
			jsonResponse(
				{ message: 'Rate limit exceeded' },
				{ status: 429, headers: { 'Retry-After': '42' } },
			),
		);

		await expect(
			makeBuildkiteRequest('/v2/user', TEST_KEY),
		).rejects.toBeInstanceOf(BuildkiteRateLimitError);
		try {
			await makeBuildkiteRequest('/v2/user', TEST_KEY);
		} catch (error) {
			expect(error).toBeInstanceOf(BuildkiteRateLimitError);
			expect((error as BuildkiteRateLimitError).retryAfterMs).toBe(42000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error as Error)).toBe(true);
			const policy = await errorHandlers.RATE_LIMIT_ERROR.handler(
				error as Error,
			);
			expect(policy.headersRetryAfterMs).toBe(42000);
		}
	});

	it('uses RateLimit-User-Reset when the 429 scope is rest_user', async () => {
		mockFetch.mockImplementation(() =>
			jsonResponse(
				{ message: 'Rate limit exceeded', scope: 'rest_user' },
				{
					status: 429,
					headers: {
						'RateLimit-Reset': '10',
						'RateLimit-User-Reset': '42',
					},
				},
			),
		);
		try {
			await makeBuildkiteRequest('/v2/user', TEST_KEY);
		} catch (error) {
			expect((error as BuildkiteRateLimitError).retryAfterMs).toBe(42000);
		}
	});

	it('waits for the later reset when 429 scope is not explicit', async () => {
		mockFetch.mockImplementation(() =>
			jsonResponse(
				{ message: 'Rate limit exceeded' },
				{
					status: 429,
					headers: {
						'RateLimit-Reset': '10',
						'RateLimit-User-Reset': '42',
					},
				},
			),
		);
		try {
			await makeBuildkiteRequest('/v2/user', TEST_KEY);
		} catch (error) {
			expect((error as BuildkiteRateLimitError).retryAfterMs).toBe(42000);
		}
	});

	it('maps a body-read abort to BuildkiteAPIError', async () => {
		mockFetch.mockResolvedValue({
			status: 200,
			ok: true,
			headers: new Headers(),
			text: () => Promise.reject(new Error('The operation was aborted')),
		});
		await expect(
			makeBuildkiteRequest('/v2/user', TEST_KEY),
		).rejects.toBeInstanceOf(BuildkiteAPIError);
	});

	it('wraps 401 as BuildkiteAPIError matched by AUTH_ERROR', async () => {
		mockFetch.mockImplementation(() =>
			jsonResponse({ message: 'Unauthorized' }, { status: 401 }),
		);
		await expect(
			makeBuildkiteRequest('/v2/user', TEST_KEY),
		).rejects.toBeInstanceOf(BuildkiteAPIError);
		try {
			await makeBuildkiteRequest('/v2/user', TEST_KEY);
		} catch (error) {
			expect(errorHandlers.AUTH_ERROR.match(error as Error)).toBe(true);
		}
	});
});

describe('official docs fixtures', () => {
	it('parses the documented access-token, meta, user, org, and agent payloads', () => {
		expect(BuildkiteAccessToken.parse(tokenFixture).scopes).toEqual([
			'read_build',
		]);
		expect(BuildkiteMeta.parse(metaFixture).webhook_ips).toHaveLength(2);
		expect(BuildkiteUser.parse(userFixture).name).toBe('John Smith');
		expect(BuildkiteOrganization.parse(orgFixture).slug).toBe('my-great-org');
		expect(BuildkiteAgent.parse(agentFixture).connection_state).toBe(
			'connected',
		);
		expect(() =>
			BuildkiteAgent.parse({
				...agentFixture,
				connection_state: 'running',
			}),
		).toThrow();
	});
});
