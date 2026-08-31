import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
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

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

beforeEach(() => {
	mockRequest.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

const ctx = {
	key: 'bkua_test_token',
	$getAccountId: async () => 'test-account',
} as never;

function lastCall() {
	expect(mockRequest).toHaveBeenCalled();
	const call = mockRequest.mock.calls[0];
	expect(call).toBeDefined();
	return { config: call?.[0], options: call?.[1] };
}

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
	graphql_id: 'VXNlci0tLWU1N2ZiYTBmLWFiMTQtNGNjMC1iYjViLTY5NTc3NGZmYmZiZQ==',
	name: 'John Smith',
	email: 'john.smith@example.com',
	avatar_url: 'https://www.gravatar.com/avatar/abc123',
	created_at: '2012-03-04T56:07:08.910Z',
};

const orgFixture = {
	id: 'bb3125de-4dc9-44cf-ad18-65d2b71a5a34',
	graphql_id:
		'T3JnYW5pemF0aW9uLS0tOGEzMjAwOTMtMjE4OC00MmNiLWI5ZGQtNzE4NjZjZTYyYjA4',
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
	name: 'my-agent',
	connection_state: 'connected',
	hostname: 'some.server',
	ip_address: '144.132.19.12',
	version: '2.1.0',
	os_id: 'linux',
	arch: 'amd64',
	queue: 'default',
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
		const plugin = buildkite({ key: 'explicit-key' });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).resolves.toBe('explicit-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = buildkite();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('getCurrentAccessToken hits GET /v2/access-token', async () => {
		mockRequest.mockResolvedValue(tokenFixture as never);
		const input = BuildkiteEndpointInputSchemas.getCurrentAccessToken.parse({});
		const result = await getCurrentAccessToken(ctx, input);
		expect(result.uuid).toBe(tokenFixture.uuid);
		BuildkiteEndpointOutputSchemas.getCurrentAccessToken.parse(result);
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://api.buildkite.com');
		expect(options?.url).toBe('/v2/access-token');
		expect(options?.method).toBe('GET');
		expect(
			(config?.HEADERS as Record<string, string> | undefined)?.Authorization,
		).toBe('Bearer bkua_test_token');
	});

	it('getMeta hits unauthenticated GET /v2/meta', async () => {
		mockRequest.mockResolvedValue(metaFixture as never);
		const input = BuildkiteEndpointInputSchemas.getMeta.parse({});
		const result = await getMeta(ctx, input);
		expect(result.webhook_ips).toEqual(metaFixture.webhook_ips);
		BuildkiteEndpointOutputSchemas.getMeta.parse(result);
		const { config, options } = lastCall();
		expect(options?.url).toBe('/v2/meta');
		expect(
			(config?.HEADERS as Record<string, string> | undefined)?.Authorization,
		).toBeUndefined();
	});

	it('getUser hits GET /v2/user', async () => {
		mockRequest.mockResolvedValue(userFixture as never);
		const input = BuildkiteEndpointInputSchemas.getUser.parse({});
		const result = await getUser(ctx, input);
		expect(result.email).toBe(userFixture.email);
		BuildkiteEndpointOutputSchemas.getUser.parse(result);
		expect(lastCall().options?.url).toBe('/v2/user');
	});

	it('listOrganizations pages with official query params', async () => {
		mockRequest.mockResolvedValue([orgFixture] as never);
		const input = BuildkiteEndpointInputSchemas.listOrganizations.parse({
			page: 2,
			per_page: 30,
		});
		const result = await listOrganizations(ctx, input);
		expect(result[0]?.slug).toBe('my-great-org');
		BuildkiteEndpointOutputSchemas.listOrganizations.parse(result);
		const { options } = lastCall();
		expect(options?.url).toBe('/v2/organizations');
		expect(options?.query).toEqual({ page: 2, per_page: 30 });
	});

	it('listPipelineAgents encodes org slug and applies official filters', async () => {
		mockRequest.mockResolvedValue([agentFixture] as never);
		const input = BuildkiteEndpointInputSchemas.listPipelineAgents.parse({
			orgSlug: 'my org/prod',
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
		const { options } = lastCall();
		expect(options?.url).toBe('/v2/organizations/my%20org%2Fprod/agents');
		expect(options?.query).toMatchObject({
			name: 'ci-agent-1',
			hostname: 'ci-box-1',
			version: '2.1.0',
			cluster_queue_id: 'c109939f-3b71-4cd3-b175-8eb79d2eb38e',
			page: 1,
			per_page: 100,
		});
	});
});

describe('Buildkite client errors', () => {
	it('wraps 429 as BuildkiteRateLimitError with retry metadata', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/v2/user' },
			{
				url: 'https://api.buildkite.com/v2/user',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Rate limit exceeded' },
			},
			'Rate limit exceeded',
			{ retryAfter: 42000 },
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeBuildkiteRequest('/v2/user', 'token'),
		).rejects.toBeInstanceOf(BuildkiteRateLimitError);
		try {
			await makeBuildkiteRequest('/v2/user', 'token');
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

	it('wraps 401 as BuildkiteAPIError matched by AUTH_ERROR', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: '/v2/user' },
			{
				url: 'https://api.buildkite.com/v2/user',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'Unauthorized' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(apiError);
		await expect(
			makeBuildkiteRequest('/v2/user', 'bad'),
		).rejects.toBeInstanceOf(BuildkiteAPIError);
		try {
			await makeBuildkiteRequest('/v2/user', 'bad');
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
	});
});
