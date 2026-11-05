// GraphQL envelopes and payloads shaped like the examples in
// https://grafbase.com/api-docs, with made-up people and organizations.
// They were not captured from the live API.

// unknown: envelope data is whatever the caller passes in.
export function envelope(data: unknown) {
	return { data };
}

// unknown: a GraphQL response path mixes field names and list indices, so the
// fixture accepts whatever shape the test needs.
export function graphQLErrorEnvelope(message: string, path?: unknown[]) {
	return {
		data: null,
		errors: [{ message, ...(path ? { path } : {}) }],
	};
}

export const viewer = {
	id: 'VXNlcjo0MjA',
	email: 'maya@fieldkit.example',
	name: 'Maya Ruiz',
	createdAt: '2025-01-10T09:00:00Z',
};

export const accountRef = {
	id: 'QWNjb3VudDo1MA',
	slug: 'fieldkit',
	name: 'Fieldkit',
	plan: 'GROWTH',
};

export const graph = {
	id: 'R3JhcGg6MTIz',
	slug: 'analytics-api',
	createdAt: '2025-02-01T12:00:00Z',
};

export const graphWithBranch = {
	...graph,
	account: accountRef,
	productionBranch: {
		id: 'QnJhbmNoOjE',
		name: 'main',
		environment: 'PRODUCTION',
	},
};

export const subgraph = {
	name: 'products',
	url: 'https://products.fieldkit.example/graphql',
	schema: 'type Product { id: ID! name: String }',
	createdAt: '2025-02-02T08:00:00Z',
	updatedAt: '2025-03-04T10:00:00Z',
};

export const schemaVersion = {
	id: 'U2NoZW1hVmVyc2lvbjox',
	createdAt: '2025-03-04T10:00:00Z',
	message: 'Add Product.name',
	schema: 'type Product { id: ID! name: String }',
	subgraph: { name: 'products' },
};

export const deployment = {
	id: 'RGVwbG95bWVudDox',
	status: 'SUCCEEDED',
	createdAt: '2025-03-04T10:00:00Z',
	startedAt: '2025-03-04T10:00:01Z',
	finishedAt: '2025-03-04T10:00:06Z',
	duration: 5000,
	message: 'Publish products',
	isRedeployable: false,
	changeCounts: {
		addedFields: 1,
		addedTypes: 0,
		changedFields: 0,
		changedTypes: 0,
		removedFields: 0,
		removedTypes: 0,
	},
	subgraph: { name: 'products' },
};

export const accessToken = {
	id: 'QWNjZXNzVG9rZW46Nw',
	name: 'ci-token',
	accountId: null,
	createdAt: '2025-03-01T00:00:00Z',
	expiresAt: '2026-03-01T00:00:00Z',
	graphScopes: [],
};

export const publishSuccess = {
	__typename: 'PublishSuccess',
};

export const publishNoChange = {
	__typename: 'PublishNoChange',
};

export const compositionError = {
	__typename: 'FederatedGraphCompositionError',
	messages: [
		'Type Product defines field name twice',
		'Unknown type Order in Product.orders',
	],
};

export const slugAlreadyExists = {
	__typename: 'SlugAlreadyExistsError',
};

export const tokenCreateSuccess = {
	__typename: 'AccessTokenCreateSuccess',
	jwt: 'gf_token_test_secret_value',
	token: accessToken,
};

export const tokenDoesNotExist = {
	__typename: 'TokenDoesNotExistError',
};
