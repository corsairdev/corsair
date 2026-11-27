import { ApiError } from 'corsair/http';
import {
	graphqlStatus,
	RailwayGraphQLError,
	railwayAuthHeaders,
	railwayErrorMessage,
} from './client';
import { railwayEndpointsNested } from './endpoints/catalog';
import { flattenConnection } from './endpoints/operations';
import type { RailwayContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is parsed per test.
	body: unknown;
};

let calls: Captured[] = [];

function reply(
	status: number,
	body: unknown,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'content-type': contentType } },
		);
	});
}

function ctx(): RailwayContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'rlwy_test_token',
		options: {},
		keys: { get_api_key: () => Promise.resolve('rlwy_test_token') },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as RailwayContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: RailwayContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = railwayEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

// `unknown` because the body is the JSON the client sent.
const sent = (n = 0) =>
	JSON.parse(String(calls[n]?.body)) as {
		query: string;
		variables: Record<string, unknown>;
	};

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('requests', () => {
	it('posts the operation document and the input as variables', async () => {
		reply(200, { data: { projectCreate: { id: 'p1', name: 'api' } } });
		const out = await endpointFor('projects.create')(ctx(), {
			input: { name: 'api', workspaceId: 'w1' },
		});
		expect(out).toMatchObject({ id: 'p1', name: 'api' });
		expect(calls[0]?.url).toBe('https://backboard.railway.com/graphql/v2');
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.headers.authorization).toBe('Bearer rlwy_test_token');
		expect(calls[0]?.headers['content-type']).toBe('application/json');
		const body = sent();
		expect(body.query).toMatch(
			/^mutation ProjectsCreate\(\$input: ProjectCreateInput!\) \{ projectCreate\(input: \$input\) \{ /,
		);
		expect(body.variables).toEqual({
			input: { name: 'api', workspaceId: 'w1' },
		});
	});

	it('sends only the arguments given', async () => {
		reply(200, {
			data: {
				projects: {
					edges: [{ node: { id: 'p1' } }, { node: { id: 'p2' } }],
					pageInfo: { hasNextPage: true, endCursor: 'c2' },
				},
			},
		});
		const page = (await endpointFor('projects.list')(ctx(), {
			first: 2,
		})) as { items: Array<{ id: string }>; pageInfo: { endCursor: string } };
		expect(sent().variables).toEqual({ first: 2 });
		expect(page.items.map((item) => item.id)).toEqual(['p1', 'p2']);
		expect(page.pageInfo.endCursor).toBe('c2');
	});

	it('returns a scalar field as it is (a variables map, a boolean)', async () => {
		reply(200, { data: { variables: { API_URL: 'https://x', PORT: '80' } } });
		await expect(
			endpointFor('variables.list')(ctx(), {
				projectId: 'p',
				environmentId: 'e',
				serviceId: 's',
			}),
		).resolves.toEqual({ API_URL: 'https://x', PORT: '80' });
		calls = [];
		reply(200, { data: { serviceDelete: true } });
		await expect(
			endpointFor('services.delete')(ctx(), { id: 's1' }),
		).resolves.toBe(true);
	});

	it('refuses unknown arguments and fields before sending, naming none of them', async () => {
		reply(200, { data: {} });
		const error = await endpointFor('projects.get')(ctx(), {
			id: 'p1',
			secret_thing: 'value',
		}).catch((e: unknown) => e as Error);
		expect(String(error)).toContain('1 unknown field (<key>)');
		expect(String(error)).toContain('this operation takes id');
		expect(String(error)).not.toContain('secret_thing');
		await expect(
			endpointFor('projects.create')(ctx(), {
				input: { name: 'x', hacker: '} } mutation { projectDelete' },
			}),
		).rejects.toThrow(/Invalid input for railway projects.create/);
		expect(calls).toHaveLength(0);
	});

	it('uses the project token header for project tokens', () => {
		expect(railwayAuthHeaders('t', 'project')).toEqual({
			'Project-Access-Token': 't',
		});
		expect(railwayAuthHeaders('t', 'workspace')).toEqual({
			Authorization: 'Bearer t',
		});
	});
});

describe('responses', () => {
	it('flattens a Relay connection and leaves anything else alone', () => {
		expect(
			flattenConnection({ edges: [{ node: { id: 1 } }], pageInfo: { a: 1 } }),
		).toEqual({ items: [{ id: 1 }], pageInfo: { a: 1 } });
		expect(flattenConnection(null)).toBeNull();
		expect(() => flattenConnection({ id: 1 })).toThrow(/without its edges/);
		expect(() => flattenConnection({ edges: 'invalid', pageInfo: {} })).toThrow(
			/without its edges/,
		);
	});

	it('keeps an answer whose only errors are inside it', async () => {
		reply(200, {
			data: {
				project: { id: 'p1', name: 'api', team: null },
			},
			errors: [{ message: 'Not Authorized', path: ['project', 'team'] }],
		});
		await expect(
			endpointFor('projects.get')(ctx(), { id: 'p1' }),
		).resolves.toMatchObject({ id: 'p1', name: 'api' });
	});

	it('refuses a response that breaks its documented types', async () => {
		reply(200, { data: { project: { id: 'p1', name: 42 } } });
		await expect(
			endpointFor('projects.get')(ctx(), { id: 'p1' }),
		).rejects.toThrow(/did not match its documented schema: name/);
	});
});

describe('errors', () => {
	it('raises a GraphQL error from a 200 with a status and scrubbed messages', async () => {
		reply(200, {
			data: null,
			errors: [
				{
					message: 'Project secret-project-id not found',
					path: ['project'],
					extensions: { code: 'INTERNAL_SERVER_ERROR' },
				},
			],
		});
		const error = (await endpointFor('projects.get')(ctx(), {
			id: 'secret-project-id',
		}).catch((e: unknown) => e)) as RailwayGraphQLError;
		expect(error).toBeInstanceOf(RailwayGraphQLError);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Railway 404: Project [REDACTED] not found');
		expect(error.paths).toEqual(['project']);
		expect(error.codes).toEqual(['INTERNAL_SERVER_ERROR']);
	});

	it('maps messages to statuses', () => {
		expect(graphqlStatus(['Not Authorized'])).toBe(403);
		expect(graphqlStatus(['Rate limit exceeded'])).toBe(429);
		expect(
			graphqlStatus([
				'You are creating projects too quickly. Try again shortly.',
			]),
		).toBe(429);
		expect(graphqlStatus(['Environment not found'])).toBe(404);
		expect(graphqlStatus(['Invalid name'])).toBe(400);
	});

	it('scrubs JSON-escaped copies of a sent value and keys of an errors map', async () => {
		reply(400, {
			message: 'bad value',
			errors: [{ message: 'value "line1\\nSECRET" is invalid' }],
			details: { 'ada@example.com': 'unknown key' },
		});
		const error = (await endpointFor('variables.upsert')(ctx(), {
			input: {
				projectId: 'p',
				environmentId: 'e',
				name: 'PEM',
				value: 'line1\nSECRET',
			},
		}).catch((e: unknown) => e)) as ApiError;
		expect(JSON.stringify(error)).not.toContain('SECRET');
		expect(JSON.stringify(error)).not.toContain('ada@example.com');
	});

	it('rebuilds an HTTP error without the variables or the token', async () => {
		reply(400, {
			errors: [{ message: 'Variable "$input" got invalid value SECRET_VALUE' }],
		});
		const error = (await endpointFor('variables.upsert')(ctx(), {
			input: {
				projectId: 'p',
				environmentId: 'e',
				name: 'TOKEN',
				value: 'SECRET_VALUE',
			},
		}).catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(400);
		expect(error.message).toContain('Railway 400');
		expect(error.request.body).toBe('[REDACTED]');
		expect(JSON.stringify(error)).not.toContain('SECRET_VALUE');
		expect(JSON.stringify(error)).not.toContain('rlwy_test_token');
	});

	it('writes messages from GraphQL, plain text and HTML bodies', () => {
		expect(
			railwayErrorMessage(400, 'Bad Request', {
				errors: [{ message: 'Syntax Error' }],
			}),
		).toBe('Railway 400: Syntax Error');
		expect(railwayErrorMessage(429, 'Too Many Requests', 'slow down')).toBe(
			'Railway 429: slow down',
		);
		expect(railwayErrorMessage(502, 'Bad Gateway', '<html>x</html>')).toBe(
			'Railway 502: Bad Gateway',
		);
	});
});
