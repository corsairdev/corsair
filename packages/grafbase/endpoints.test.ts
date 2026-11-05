import { logEventFromContext } from 'corsair/core';
import { GrafbaseAPIError } from './client';
import {
	AccessTokens,
	Deployments,
	Graphs,
	SchemaVersions,
	Subgraphs,
	Viewer,
} from './endpoints';
import {
	accessToken,
	accountRef,
	compositionError,
	deployment,
	envelope,
	graph,
	graphQLErrorEnvelope,
	graphWithBranch,
	publishSuccess,
	schemaVersion,
	subgraph,
	tokenCreateSuccess,
	tokenDoesNotExist,
	viewer,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'gf-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: negative cases pass values no schema accepts.
async function invoke<T>(
	endpoint: (ctx: never, input: never) => Promise<T>,
	input: unknown,
): Promise<T> {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.grafbase.com');
	expect(sent.path).toBe('/graphql');
	expect(sent.method).toBe('POST');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

// unknown: the query document is generated code, only grepped for its root
// field and variable names here.
function sentQuery() {
	const sent = lastRequest();
	const body = sent.body as { query?: string; variables?: unknown };
	return {
		query: body.query ?? '',
		variables: body.variables as Record<string, unknown> | undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('viewer.get', () => {
	it('returns the viewer and authenticates with Bearer', async () => {
		respond(envelope({ viewer }));

		const result = await invoke(Viewer.get, {});

		expectAuthenticated();
		expect(sentQuery().query).toContain('query ViewerGet');
		expect(result).toEqual({ viewer });
	});

	it('rejects on a GraphQL error response', async () => {
		respond(graphQLErrorEnvelope('Unauthorized'));

		const error = await invoke(Viewer.get, {}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(GrafbaseAPIError);
		expect((error as GrafbaseAPIError).message).toContain('Unauthorized');
	});
});

describe('graphs.list', () => {
	it('queries accountBySlug and flattens the connection page', async () => {
		respond(
			envelope({
				accountBySlug: {
					...accountRef,
					graphs: {
						nodes: [
							graph,
							{ ...graph, id: 'R3JhcGg6MTI0', slug: 'billing-api' },
						],
						pageInfo: { hasNextPage: true, endCursor: 'cursor-2' },
					},
				},
			}),
		);

		const result = await invoke(Graphs.list, {
			accountSlug: 'fieldkit',
			first: 2,
		});

		expectAuthenticated();
		const sent = sentQuery();
		expect(sent.query).toContain('accountBySlug(slug: $slug)');
		expect(sent.variables).toEqual({
			slug: 'fieldkit',
			first: 2,
			after: undefined,
		});
		expect(result).toEqual({
			account: accountRef,
			graphs: [graph, { ...graph, id: 'R3JhcGg6MTI0', slug: 'billing-api' }],
			hasNextPage: true,
			nextCursor: 'cursor-2',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'grafbase.graphs.list',
			{ accountSlug: 'fieldkit', count: 2 },
			'completed',
		);
	});

	it('ends the page with a null cursor when the account has no graphs', async () => {
		respond(envelope({ accountBySlug: null }));

		const result = await invoke(Graphs.list, { accountSlug: 'fieldkit' });

		expect(result).toEqual({
			account: null,
			graphs: [],
			hasNextPage: false,
			nextCursor: null,
		});
	});
});

describe('graphs.get', () => {
	it('reads a graph by account and graph slug', async () => {
		respond(envelope({ graphByAccountSlug: graphWithBranch }));

		const result = await invoke(Graphs.get, {
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
		});

		expectAuthenticated();
		expect(sentQuery().query).toContain('graphByAccountSlug');
		expect(sentQuery().variables).toEqual({
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
		});
		expect(result.graph).toEqual(graphWithBranch);
	});

	it('returns a null graph when the slug does not exist', async () => {
		respond(envelope({ graphByAccountSlug: null }));

		const result = await invoke(Graphs.get, {
			accountSlug: 'fieldkit',
			graphSlug: 'missing',
		});

		expect(result).toEqual({ graph: null });
	});
});

describe('graphs.create', () => {
	it('sends the account id and slug and returns the created graph', async () => {
		respond(
			envelope({
				graphCreate: {
					__typename: 'GraphCreateSuccess',
					graph: graphWithBranch,
				},
			}),
		);

		const result = await invoke(Graphs.create, {
			accountId: accountRef.id,
			graphSlug: 'analytics-api',
		});

		expectAuthenticated();
		const sent = sentQuery();
		expect(sent.query).toContain('mutation GraphsCreate');
		expect(sent.variables).toEqual({
			input: { accountId: accountRef.id, graphSlug: 'analytics-api' },
		});
		expect(result).toEqual({
			__typename: 'GraphCreateSuccess',
			graph: graphWithBranch,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'grafbase.graphs.create',
			{
				graphSlug: 'analytics-api',
				outcome: 'GraphCreateSuccess',
				graphId: graph.id,
			},
			'completed',
		);
	});

	it('surfaces a slug conflict as the union outcome, not an exception', async () => {
		respond(
			envelope({ graphCreate: { __typename: 'SlugAlreadyExistsError' } }),
		);

		const result = await invoke(Graphs.create, {
			accountId: accountRef.id,
			graphSlug: 'analytics-api',
		});

		expect(result).toEqual({ __typename: 'SlugAlreadyExistsError' });
	});
});

describe('graphs.delete', () => {
	it('sends the graph id and reports the outcome', async () => {
		respond(envelope({ graphDelete: { __typename: 'GraphDeleteSuccess' } }));

		const result = await invoke(Graphs.delete, { id: graph.id });

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({ input: { id: graph.id } });
		expect(result).toEqual({ __typename: 'GraphDeleteSuccess' });
	});
});

describe('subgraphs.get', () => {
	it('reads the subgraph with routing url and schema', async () => {
		respond(envelope({ subgraph }));

		const result = await invoke(Subgraphs.get, {
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
			subgraphName: 'products',
			branch: 'main',
		});

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
			branch: 'main',
			subgraphName: 'products',
		});
		expect(result).toEqual({ subgraph });
	});
});

describe('subgraphs.publish', () => {
	it('publishes the SDL and variables exactly as the input names them', async () => {
		respond(envelope({ publish: publishSuccess }));

		const result = await invoke(Subgraphs.publish, {
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
			subgraph: 'products',
			schema: 'type Product { id: ID! name: String }',
			url: 'https://products.fieldkit.example/graphql',
			message: 'Add Product.name',
		});

		expectAuthenticated();
		const sent = sentQuery();
		expect(sent.query).toContain('mutation SubgraphsPublish');
		expect(sent.variables).toEqual({
			input: {
				accountSlug: 'fieldkit',
				graphSlug: 'analytics-api',
				subgraph: 'products',
				schema: 'type Product { id: ID! name: String }',
				url: 'https://products.fieldkit.example/graphql',
				branch: undefined,
				message: 'Add Product.name',
				virtual: undefined,
			},
		});
		expect(result).toEqual(publishSuccess);
	});

	it('carries composition error messages in the outcome', async () => {
		respond(envelope({ publish: compositionError }));

		const result = await invoke(Subgraphs.publish, {
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
			subgraph: 'products',
			schema: 'type Product { id: ID! name: String }',
		});

		expect(result).toEqual(compositionError);
	});
});

describe('subgraphs.delete', () => {
	it('defaults dryRun to false and reports the outcome', async () => {
		respond(
			envelope({
				deleteSubgraph: { __typename: 'DeleteSubgraphSuccess' },
			}),
		);

		const result = await invoke(Subgraphs.delete, {
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
			branch: 'main',
			subgraph: 'products',
		});

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({
			input: {
				accountSlug: 'fieldkit',
				graphSlug: 'analytics-api',
				branch: 'main',
				subgraph: 'products',
				dryRun: false,
				message: undefined,
			},
		});
		expect(result).toEqual({ __typename: 'DeleteSubgraphSuccess' });
	});

	it('sends dry run without deploying', async () => {
		respond(
			envelope({
				deleteSubgraph: { __typename: 'DeleteSubgraphSuccess' },
			}),
		);

		await invoke(Subgraphs.delete, {
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
			branch: 'main',
			subgraph: 'products',
			dryRun: true,
		});

		expect(sentQuery().variables).toEqual({
			input: {
				accountSlug: 'fieldkit',
				graphSlug: 'analytics-api',
				branch: 'main',
				subgraph: 'products',
				dryRun: true,
				message: undefined,
			},
		});
	});
});

describe('schemaVersions.list', () => {
	it('defaults populated to true and pages through versions', async () => {
		respond(
			envelope({
				schemaVersions: {
					nodes: [schemaVersion],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			}),
		);

		const result = await invoke(SchemaVersions.list, {
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
		});

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({
			accountSlug: 'fieldkit',
			graphSlug: 'analytics-api',
			branch: undefined,
			subgraphName: undefined,
			populated: true,
			first: undefined,
			after: undefined,
		});
		expect(result).toEqual({
			versions: [schemaVersion],
			hasNextPage: false,
			nextCursor: null,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'grafbase.schemaVersions.list',
			{ count: 1 },
			'completed',
		);
	});
});

describe('deployments.get', () => {
	it('reads status and change counts by deployment id', async () => {
		respond(envelope({ deployment }));

		const result = await invoke(Deployments.get, { id: deployment.id });

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({ id: deployment.id });
		expect(result).toEqual({ deployment });
	});

	it('returns null for an unknown deployment', async () => {
		respond(envelope({ deployment: null }));

		const result = await invoke(Deployments.get, { id: 'missing' });

		expect(result).toEqual({ deployment: null });
	});
});

describe('accessTokens.list', () => {
	it('lists tokens with expiry and scopes', async () => {
		respond(
			envelope({
				accessTokens: {
					nodes: [accessToken],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			}),
		);

		const result = await invoke(AccessTokens.list, { first: 10 });

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({ first: 10, after: undefined });
		expect(result).toEqual({
			tokens: [accessToken],
			hasNextPage: false,
			nextCursor: null,
		});
	});
});

describe('accessTokens.create', () => {
	it('returns the one-time jwt and never logs it', async () => {
		respond(envelope({ accessTokenCreate: tokenCreateSuccess }));

		const result = await invoke(AccessTokens.create, {
			name: 'ci-token',
			kind: 'USER',
		});

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({
			input: {
				name: 'ci-token',
				kind: 'USER',
				accountId: undefined,
				expiresAt: undefined,
				graphScopes: undefined,
			},
		});
		expect(result).toEqual(tokenCreateSuccess);
		const logged = mockLog.mock.calls.at(-1)?.[2];
		expect(logged).toEqual({
			name: 'ci-token',
			kind: 'USER',
			outcome: 'AccessTokenCreateSuccess',
			tokenId: accessToken.id,
		});
		expect(JSON.stringify(logged)).not.toContain(tokenCreateSuccess.jwt);
	});

	it('rejects an ACCOUNT token without an accountId before any request', async () => {
		await expect(
			invoke(AccessTokens.create, { name: 'org-token', kind: 'ACCOUNT' }),
		).rejects.toThrow(/ACCOUNT tokens need accountId/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('accessTokens.delete', () => {
	it('sends the token id and reports the outcome', async () => {
		respond(
			envelope({
				accessTokenDelete: { __typename: 'AccessTokenDeleteSuccess' },
			}),
		);

		const result = await invoke(AccessTokens.delete, { id: accessToken.id });

		expectAuthenticated();
		expect(sentQuery().variables).toEqual({ input: { id: accessToken.id } });
		expect(result).toEqual({ __typename: 'AccessTokenDeleteSuccess' });
	});

	it('surfaces a missing token as the union outcome', async () => {
		respond(
			envelope({ accessTokenDelete: { __typename: 'TokenDoesNotExistError' } }),
		);

		const result = await invoke(AccessTokens.delete, { id: 'missing' });

		expect(result).toEqual({ __typename: 'TokenDoesNotExistError' });
	});

	it('matches the token fixture against the docs example', () => {
		expect(tokenDoesNotExist.__typename).toBe('TokenDoesNotExistError');
	});
});
