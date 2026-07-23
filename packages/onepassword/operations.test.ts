import { logEventFromContext } from 'corsair/core';
import { makeOnePasswordRequest } from './client';
import { Items, Vaults } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	makeOnePasswordRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeOnePasswordRequest);
const mockLog = jest.mocked(logEventFromContext);

// Endpoint closures are heterogeneous; unknown avoids a mega shared Ctx/Input union.
type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

const CONNECT_URL = 'http://connect.test:8080';

function createContext() {
	return {
		key: 'test-api-token',
		options: {
			authType: 'api_key' as const,
			connectUrl: CONNECT_URL,
		},
		db: {},
	};
}

describe('OnePassword endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockResolvedValue({ ok: true });
	});

	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		input: Record<string, unknown>;
		path: string;
		method: string;
		body?: Record<string, unknown>;
		query?: Record<string, unknown>;
	}> = [
		{
			name: 'vaults.list',
			fn: Vaults.list as AnyEndpoint,
			input: {},
			path: 'v1/vaults',
			method: 'GET',
		},
		{
			name: 'vaults.get',
			fn: Vaults.get as AnyEndpoint,
			input: { id: 'vault-1' },
			path: 'v1/vaults/vault-1',
			method: 'GET',
		},
		{
			name: 'items.list',
			fn: Items.list as AnyEndpoint,
			input: { vaultId: 'vault-1', limit: 25, offset: 50 },
			path: 'v1/vaults/vault-1/items',
			method: 'GET',
			query: { limit: 25, offset: 50 },
		},
		{
			name: 'items.get',
			fn: Items.get as AnyEndpoint,
			input: { vaultId: 'vault-1', id: 'item-1' },
			path: 'v1/vaults/vault-1/items/item-1',
			method: 'GET',
		},
		{
			name: 'items.create',
			fn: Items.create as AnyEndpoint,
			input: {
				vaultId: 'vault-1',
				title: 'API Key',
				category: 'API_CREDENTIAL',
			},
			path: 'v1/vaults/vault-1/items',
			method: 'POST',
			body: {
				title: 'API Key',
				category: 'API_CREDENTIAL',
				vault: { id: 'vault-1' },
			},
		},
		{
			name: 'items.update',
			fn: Items.update as AnyEndpoint,
			input: {
				vaultId: 'vault-1',
				id: 'item-1',
				title: 'API Key',
				category: 'API_CREDENTIAL',
			},
			path: 'v1/vaults/vault-1/items/item-1',
			method: 'PUT',
			body: {
				id: 'item-1',
				vault: { id: 'vault-1' },
				title: 'API Key',
				category: 'API_CREDENTIAL',
			},
		},
		{
			name: 'items.delete',
			fn: Items.delete as AnyEndpoint,
			input: { vaultId: 'vault-1', id: 'item-1' },
			path: 'v1/vaults/vault-1/items/item-1',
			method: 'DELETE',
		},
	];

	it.each(cases)(
		'$name drives the endpoint closure against $path',
		async ({ fn, input, path, method, body, query }) => {
			const ctx = createContext();
			await fn(ctx, input);

			expect(mockRequest).toHaveBeenCalledWith(
				CONNECT_URL,
				path,
				ctx.key,
				expect.objectContaining({
					method,
					...(body ? { body: expect.objectContaining(body) } : {}),
					...(query ? { query } : {}),
				}),
			);
			expect(mockLog).toHaveBeenCalled();
		},
	);
});
