import { useCallback, useEffect, useReducer, useRef } from 'react';
import type {
	ConnectionStatus,
	ConnectLink,
	CreateConnectLinkInput,
	CreateTenantInput,
	OAuthCallbackInput,
	OAuthCallbackResult,
	PermissionRecord,
	PluginInfo,
	Tenant,
} from '../../core/management/types';
import { createCorsairClient } from '../index';
import type { CorsairClientOptions, CorsairManagementClient } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// createCorsairReactClient — React hooks wrapping the vanilla management client.
//
// Pattern mirrors better-auth's React client: a factory function that closes
// over one client instance and returns typed hooks. This avoids a React context
// requirement while still letting apps share a single fetch-client across hooks.
//
// Usage:
//   const { useTenants, usePlugins, useConnectionStatus, useConnect } =
//     createCorsairReactClient({ baseURL: '/api/corsair' });
//
//   function Dashboard() {
//     const { data: tenants, loading } = useTenants();
//     const { data: plugins } = usePlugins();
//   }
// ─────────────────────────────────────────────────────────────────────────────

// ── shared async state machine ────────────────────────────────────────────

type AsyncState<T> =
	| { status: 'idle'; data: null; error: null; loading: false }
	| { status: 'loading'; data: null; error: null; loading: true }
	| { status: 'success'; data: T; error: null; loading: false }
	| { status: 'error'; data: null; error: Error; loading: false };

type AsyncAction<T> =
	| { type: 'FETCH' }
	| { type: 'SUCCESS'; data: T }
	| { type: 'ERROR'; error: Error }
	| { type: 'RESET' };

function asyncReducer<T>(
	_state: AsyncState<T>,
	action: AsyncAction<T>,
): AsyncState<T> {
	switch (action.type) {
		case 'FETCH':
			return { status: 'loading', data: null, error: null, loading: true };
		case 'SUCCESS':
			return {
				status: 'success',
				data: action.data,
				error: null,
				loading: false,
			};
		case 'ERROR':
			return {
				status: 'error',
				data: null,
				error: action.error,
				loading: false,
			};
		case 'RESET':
			return { status: 'idle', data: null, error: null, loading: false };
	}
}

const IDLE = {
	status: 'idle' as const,
	data: null,
	error: null,
	loading: false as const,
};

// useAsync — runs `fn` on mount (and when `deps` change), tracks loading/error/data.
function useAsync<T>(
	fn: () => Promise<T>,
	// unknown[] mirrors React's own DependencyList (readonly unknown[]) — a
	// dependency may be any primitive, object, or undefined passed by callers,
	// so a stricter element type isn't feasible here.
	deps: unknown[],
): AsyncState<T> & { refetch: () => void } {
	const [state, dispatch] = useReducer(
		asyncReducer as (s: AsyncState<T>, a: AsyncAction<T>) => AsyncState<T>,
		IDLE as AsyncState<T>,
	);

	// Stable ref so the effect always calls the latest fn without re-registering
	const fnRef = useRef(fn);
	fnRef.current = fn;

	// Monotonic token: only the most recent run may dispatch. A slow earlier
	// request (e.g. after deps change from 'a' to 'b') can no longer overwrite a
	// newer run's result, and unmount/dep-change cleanup invalidates in-flight work.
	const runIdRef = useRef(0);

	const run = useCallback(() => {
		const runId = ++runIdRef.current;
		dispatch({ type: 'FETCH' });
		fnRef
			.current()
			.then((data) => {
				if (runId === runIdRef.current) dispatch({ type: 'SUCCESS', data });
			})
			.catch((err: unknown) => {
				if (runId === runIdRef.current) {
					dispatch({
						type: 'ERROR',
						error: err instanceof Error ? err : new Error(String(err)),
					});
				}
			});
	}, []);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		run();
		return () => {
			// Invalidate the in-flight request so a stale resolve can't clobber
			// the next run's state.
			runIdRef.current++;
		};
	}, deps);

	return { ...state, refetch: run };
}

// ── mutation hook ──────────────────────────────────────────────────────────

type MutationState<TInput, TResult> = {
	data: TResult | null;
	loading: boolean;
	error: Error | null;
	mutate: (input: TInput) => Promise<TResult>;
};

function useMutation<TInput, TResult>(
	fn: (input: TInput) => Promise<TResult>,
): {
	data: TResult | null;
	loading: boolean;
	error: Error | null;
	mutate: (input: TInput) => Promise<TResult>;
} {
	const [state, dispatch] = useReducer(
		asyncReducer as (
			s: AsyncState<TResult>,
			a: AsyncAction<TResult>,
		) => AsyncState<TResult>,
		IDLE as AsyncState<TResult>,
	);

	const mutate = useCallback(
		async (input: TInput): Promise<TResult> => {
			dispatch({ type: 'FETCH' });
			try {
				const result = await fn(input);
				dispatch({ type: 'SUCCESS', data: result });
				return result;
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				dispatch({ type: 'ERROR', error });
				throw error;
			}
		},
		// fn is stable when createCorsairReactClient closes over a fixed client
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return {
		data: state.data,
		loading: state.loading,
		error: state.error,
		mutate,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// Public factory
// ─────────────────────────────────────────────────────────────────────────────

export type CorsairReactClientOptions = CorsairClientOptions;

export function createCorsairReactClient(opts: CorsairReactClientOptions) {
	const client: CorsairManagementClient = createCorsairClient(opts);

	// ── tenants ──────────────────────────────────────────────────────────────

	/** Fetch and subscribe to the tenant list. Re-fetches on `refetch()`. */
	function useTenants() {
		return useAsync(() => client.tenants.list(), []);
	}

	/** Fetch a single tenant by id. Re-fetches when `id` changes. */
	function useTenant(id: string) {
		return useAsync(() => client.tenants.get(id), [id]);
	}

	/**
	 * Create a tenant. Returns a `mutate(input)` function.
	 * `loading` tracks in-flight state; `data` holds the created Tenant on success.
	 *
	 * @example
	 * const { mutate: createTenant, loading } = useCreateTenant();
	 * await createTenant({ id: 'acme' });
	 */
	function useCreateTenant() {
		return useMutation<CreateTenantInput, Tenant>((input) =>
			client.tenants.create(input),
		);
	}

	// ── plugins ───────────────────────────────────────────────────────────────

	/** Fetch the full plugin catalog with configured/missing-fields status. */
	function usePlugins() {
		return useAsync(() => client.plugins.list(), []);
	}

	/** Fetch a single plugin by id. Re-fetches when `id` changes. */
	function usePlugin(id: string) {
		return useAsync(() => client.plugins.get(id), [id]);
	}

	// ── connection status ─────────────────────────────────────────────────────

	/**
	 * Fetch per-plugin connection status for a tenant.
	 * Returns `{ github: 'connected', slack: 'not_connected', ... }`.
	 * Re-fetches when `tenantId` changes.
	 */
	function useConnectionStatus(query?: { tenantId?: string }) {
		return useAsync(
			() => client.connectionStatus.get(query),
			[query?.tenantId],
		);
	}

	// ── permissions ───────────────────────────────────────────────────────────

	/** Fetch a permission record by id or token. Re-fetches when the lookup key changes. */
	function usePermission(input: { id: string } | { token: string }) {
		const key = 'id' in input ? input.id : input.token;
		return useAsync(() => client.permissions.get(input), [key]);
	}

	// ── connect / OAuth ───────────────────────────────────────────────────────

	/**
	 * Create a connect URL for a plugin + tenant.
	 * With `hub` config, redirects to Corsair Hub. With `manual` config, redirects
	 * to your self-hosted connect page. Redirect the user to `data.connectUrl`.
	 *
	 * @example
	 * const { mutate: createLink, data, loading } = useCreateConnectLink();
	 * const { connectUrl } = await createLink({ plugin: 'github', tenantId: 'acme' });
	 * window.location.href = connectUrl;
	 */
	function useCreateConnectLink() {
		return useMutation<CreateConnectLinkInput, ConnectLink>((input) =>
			client.connect.createLink(input),
		);
	}

	/**
	 * Complete the OAuth callback after the user returns from the provider.
	 * Call `mutate({ code, state })` with the values from the OAuth redirect.
	 *
	 * @example
	 * const { mutate: completeOAuth } = useOAuthCallback();
	 * await completeOAuth({ code: searchParams.get('code'), state: searchParams.get('state') });
	 */
	function useOAuthCallback() {
		return useMutation<OAuthCallbackInput, OAuthCallbackResult>((input) =>
			client.connect.oauthCallback(input),
		);
	}

	return {
		// vanilla client — escape hatch for direct calls
		client,
		// tenant hooks
		useTenants,
		useTenant,
		useCreateTenant,
		// plugin hooks
		usePlugins,
		usePlugin,
		// connection status
		useConnectionStatus,
		// permission hooks
		usePermission,
		// connect / OAuth hooks
		useCreateConnectLink,
		useOAuthCallback,
	};
}

// Re-export types that hook consumers need
export type {
	AsyncState,
	ConnectLink,
	ConnectionStatus,
	CreateConnectLinkInput,
	CreateTenantInput,
	OAuthCallbackInput,
	OAuthCallbackResult,
	PermissionLookupInput,
	PermissionRecord,
	PluginInfo,
	Tenant,
};
