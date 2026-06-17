/**
 * @jest-environment jsdom
 */

/**
 * Tests for createCorsairReactClient — Phase 3.
 *
 * We mock the underlying vanilla client entirely. The vanilla client's
 * correctness is already proven in management-client.test.ts. These tests
 * verify that each hook:
 *   1. Starts in the correct idle/loading state
 *   2. Transitions to success when the client resolves
 *   3. Transitions to error when the client rejects
 *   4. Re-fetches when the relevant dependency changes
 *   5. Exposes a stable `refetch` function
 *
 * No DOM, no real HTTP server, no fetch polyfill needed.
 */

import { act, renderHook, waitFor } from '@testing-library/react';
import { createCorsairReactClient } from '../client/react';
import type { CorsairManagementClient } from '../client/types';

// ── mock client factory ───────────────────────────────────────────────────

type MockClient = {
	[K in keyof CorsairManagementClient]: CorsairManagementClient[K] extends object
		? {
				[M in keyof CorsairManagementClient[K]]: jest.MockedFunction<
					// any[] is required here: this conditional only needs to test
					// whether the member is *callable* to extract its real signature,
					// and the `infer`-free `(...a: any[]) => any` is the standard way
					// to match an arbitrary function type without narrowing it.
					CorsairManagementClient[K][M] extends (...a: any[]) => any
						? CorsairManagementClient[K][M]
						: never
				>;
			}
		: CorsairManagementClient[K];
};

function makeMockClient(): MockClient {
	return {
		ok: jest.fn(),
		tenants: {
			list: jest.fn(),
			create: jest.fn(),
			get: jest.fn(),
		},
		plugins: {
			list: jest.fn(),
			get: jest.fn(),
		},
		connectionStatus: {
			get: jest.fn(),
		},
		permissions: {
			get: jest.fn(),
			getByToken: jest.fn(),
		},
		connect: {
			createLink: jest.fn(),
			resolve: jest.fn(),
			oauthCallback: jest.fn(),
		},
	} as unknown as MockClient;
}

// Inject a mock client into createCorsairReactClient by patching the
// createCorsairClient import. Simpler: just expose the client on the
// returned object and spy on it.
jest.mock('../client/index', () => ({
	createCorsairClient: jest.fn(),
}));

import { createCorsairClient } from '../client/index';

const mockCreateClient = createCorsairClient as jest.MockedFunction<
	typeof createCorsairClient
>;

let mockClient: MockClient;

beforeEach(() => {
	mockClient = makeMockClient();
	mockCreateClient.mockReturnValue(
		mockClient as unknown as CorsairManagementClient,
	);
});

afterEach(() => {
	jest.clearAllMocks();
});

function makeHooks() {
	return createCorsairReactClient({ baseURL: 'http://localhost/api/corsair' });
}

// ── useTenants ────────────────────────────────────────────────────────────

describe('useTenants', () => {
	it('starts loading, resolves with data', async () => {
		const tenants = [{ id: 'acme', accounts: [], connectedPlugins: [] }];
		(mockClient.tenants.list as jest.Mock).mockResolvedValue(tenants);

		const { result } = renderHook(() => makeHooks().useTenants());

		expect(result.current.loading).toBe(true);
		expect(result.current.data).toBeNull();

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.loading).toBe(false);
		expect(result.current.data).toEqual(tenants);
		expect(result.current.error).toBeNull();
	});

	it('transitions to error when fetch fails', async () => {
		(mockClient.tenants.list as jest.Mock).mockRejectedValue(
			new Error('network error'),
		);

		const { result } = renderHook(() => makeHooks().useTenants());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.loading).toBe(false);
		expect(result.current.data).toBeNull();
		expect(result.current.error?.message).toBe('network error');
	});

	it('refetch re-runs the request', async () => {
		(mockClient.tenants.list as jest.Mock).mockResolvedValue([]);
		const hooks = makeHooks();
		const { result } = renderHook(() => hooks.useTenants());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(mockClient.tenants.list).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.refetch();
		});
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(mockClient.tenants.list).toHaveBeenCalledTimes(2);
	});
});

// ── useTenant ─────────────────────────────────────────────────────────────

describe('useTenant', () => {
	it('fetches by id and resolves', async () => {
		const tenant = { id: 'acme', accounts: [], connectedPlugins: [] };
		(mockClient.tenants.get as jest.Mock).mockResolvedValue(tenant);

		const hooks = makeHooks();
		const { result } = renderHook(() => hooks.useTenant('acme'));

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toEqual(tenant);
		expect(mockClient.tenants.get).toHaveBeenCalledWith('acme');
	});

	it('re-fetches when id changes', async () => {
		(mockClient.tenants.get as jest.Mock)
			.mockResolvedValueOnce({ id: 'a', accounts: [], connectedPlugins: [] })
			.mockResolvedValueOnce({ id: 'b', accounts: [], connectedPlugins: [] });

		const hooks = makeHooks();
		let id = 'a';
		const { result, rerender } = renderHook(() => hooks.useTenant(id));

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data?.id).toBe('a');

		id = 'b';
		rerender();
		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data?.id).toBe('b');
		expect(mockClient.tenants.get).toHaveBeenCalledTimes(2);
	});
});

// ── useCreateTenant ───────────────────────────────────────────────────────

describe('useCreateTenant', () => {
	it('starts idle, mutate resolves and sets data', async () => {
		const created = { id: 'new-tenant', accounts: [], connectedPlugins: [] };
		(mockClient.tenants.create as jest.Mock).mockResolvedValue(created);

		const hooks = makeHooks();
		const { result } = renderHook(() => hooks.useCreateTenant());

		expect(result.current.loading).toBe(false);
		expect(result.current.data).toBeNull();

		await act(async () => {
			await result.current.mutate({ id: 'new-tenant' });
		});

		expect(result.current.loading).toBe(false);
		expect(result.current.data).toEqual(created);
		expect(result.current.error).toBeNull();
	});

	it('mutate rejects and sets error', async () => {
		(mockClient.tenants.create as jest.Mock).mockRejectedValue(
			new Error('already exists'),
		);

		const hooks = makeHooks();
		const { result } = renderHook(() => hooks.useCreateTenant());

		await act(async () => {
			await result.current.mutate({ id: 'dup' }).catch(() => {
				/* expected */
			});
		});

		await waitFor(() =>
			expect(result.current.error?.message).toBe('already exists'),
		);
	});
});

// ── usePlugins ────────────────────────────────────────────────────────────

describe('usePlugins', () => {
	it('returns plugin list', async () => {
		const plugins = [
			{
				id: 'github',
				authType: 'oauth_2' as const,
				configured: false,
				missingFields: ['client_id'],
				oauth: null,
			},
			{
				id: 'slack',
				authType: 'oauth_2' as const,
				configured: true,
				missingFields: [],
				oauth: null,
			},
		];
		(mockClient.plugins.list as jest.Mock).mockResolvedValue(plugins);

		const { result } = renderHook(() => makeHooks().usePlugins());

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data).toEqual(plugins);
	});
});

describe('usePlugin', () => {
	it('fetches single plugin by id', async () => {
		const plugin = {
			id: 'slack',
			authType: 'oauth_2' as const,
			configured: false,
			missingFields: [],
			oauth: null,
		};
		(mockClient.plugins.get as jest.Mock).mockResolvedValue(plugin);

		const { result } = renderHook(() => makeHooks().usePlugin('slack'));
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data?.id).toBe('slack');
		expect(mockClient.plugins.get).toHaveBeenCalledWith('slack');
	});
});

// ── useConnectionStatus ───────────────────────────────────────────────────

describe('useConnectionStatus', () => {
	it('returns connection status map', async () => {
		const status = {
			github: 'not_connected' as const,
			slack: 'connected' as const,
		};
		(mockClient.connectionStatus.get as jest.Mock).mockResolvedValue(status);

		const { result } = renderHook(() =>
			makeHooks().useConnectionStatus({ tenantId: 'acme' }),
		);

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.data).toEqual(status);
		expect(mockClient.connectionStatus.get).toHaveBeenCalledWith({
			tenantId: 'acme',
		});
	});

	it('re-fetches when tenantId changes', async () => {
		(mockClient.connectionStatus.get as jest.Mock).mockResolvedValue({});

		const hooks = makeHooks();
		let tenantId = 'a';
		const { result, rerender } = renderHook(() =>
			hooks.useConnectionStatus({ tenantId }),
		);

		await waitFor(() => expect(result.current.loading).toBe(false));
		tenantId = 'b';
		rerender();
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(mockClient.connectionStatus.get).toHaveBeenCalledTimes(2);
		expect(mockClient.connectionStatus.get).toHaveBeenLastCalledWith({
			tenantId: 'b',
		});
	});
});

// ── usePermission ─────────────────────────────────────────────────────────

describe('usePermission', () => {
	it('fetches permission by id', async () => {
		(mockClient.permissions.get as jest.Mock).mockResolvedValue({
			id: 'perm-1',
		});

		const { result } = renderHook(() => makeHooks().usePermission('perm-1'));
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toEqual({ id: 'perm-1' });
	});
});

describe('usePermissionByToken', () => {
	it('fetches permission by token', async () => {
		(mockClient.permissions.getByToken as jest.Mock).mockResolvedValue({
			id: 'perm-1',
		});

		const { result } = renderHook(() =>
			makeHooks().usePermissionByToken('tok_abc'),
		);
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.data).toEqual({ id: 'perm-1' });
		expect(mockClient.permissions.getByToken).toHaveBeenCalledWith('tok_abc');
	});
});

// ── useCreateConnectLink ──────────────────────────────────────────────────

describe('useCreateConnectLink', () => {
	it('starts idle', () => {
		const { result } = renderHook(() => makeHooks().useCreateConnectLink());
		expect(result.current.loading).toBe(false);
		expect(result.current.data).toBeNull();
		expect(result.current.error).toBeNull();
	});

	it('mutate returns connect link', async () => {
		const link = {
			connectUrl: 'https://github.com/login/oauth/authorize?...',
			state: 'hmac_signed',
		};
		(mockClient.connect.createLink as jest.Mock).mockResolvedValue(link);

		const hooks = makeHooks();
		const { result } = renderHook(() => hooks.useCreateConnectLink());

		await act(async () => {
			await result.current.mutate({ plugin: 'github', tenantId: 'acme' });
		});

		expect(result.current.data).toEqual(link);
		expect(mockClient.connect.createLink).toHaveBeenCalledWith({
			plugin: 'github',
			tenantId: 'acme',
		});
	});
});

// ── useOAuthCallback ──────────────────────────────────────────────────────

describe('useOAuthCallback', () => {
	it('mutate completes OAuth and returns plugin + tenantId', async () => {
		const callbackResult = { plugin: 'github', tenantId: 'acme' };
		(mockClient.connect.oauthCallback as jest.Mock).mockResolvedValue(
			callbackResult,
		);

		const hooks = makeHooks();
		const { result } = renderHook(() => hooks.useOAuthCallback());

		await act(async () => {
			await result.current.mutate({
				code: 'gh_code_123',
				state: 'hmac_signed_state',
			});
		});

		expect(result.current.data).toEqual(callbackResult);
	});
});
