'use client';

import type { ReactElement, ReactNode } from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react';
import type { ConnectionStatus } from '../../core/management/types';
import { createCorsairClient } from '../index';
import type { CorsairManagementClient } from '../types';
import type { ConnectWaiters } from './connect-controller';
import {
	confirmConnected,
	connectReducer,
	createConnectWaiters,
	initialConnectState,
	isConnectError,
	retryAfterConnect,
	shouldCoalesceConnect,
	shouldSettleConnected,
} from './connect-controller';
import type { ConnectAppearance } from './connect-overlay';
import { ConnectOverlay } from './connect-overlay';

const WATCH_INTERVAL_MS = 2000;
// Grace after the popup closes for the final status poll to confirm a completed
// connect before a closed popup is read as the user backing out.
const POPUP_CLOSE_GRACE_MS = 1500;

/** Whether a failed call needs a connect, and how the user answered. */
export type RequireConnectOutcome = 'connected' | 'cancelled' | 'none';

export type CorsairContextValue = {
	client: CorsairManagementClient;
	/** Mint a fresh link and open the overlay (proactive "Connect X" button). */
	connect: (plugin: string, opts?: { tenantId?: string }) => Promise<boolean>;
	/** Wrap a mutation so it auto-resumes after connect (opt-in, no re-click). */
	call: <T>(fn: () => Promise<T>) => Promise<T | null>;
	/** Read the pending connect-request and open the overlay. Used by the boundary
	 * and by `call` — returns 'none' when there's nothing to connect. */
	requireConnect: () => Promise<RequireConnectOutcome>;
	/** Per-plugin connection status for the default scope, or `null` until the
	 * first fetch resolves. Refetched after every successful connect. */
	connections: ConnectionStatus | null;
	/** `true` while the connection-status fetch is in flight. */
	connectionsLoading: boolean;
	/** Force a connection-status refetch (e.g. after an out-of-band change). */
	refreshConnections: () => void;
};

const CorsairContext = createContext<CorsairContextValue | null>(null);

/** Props for {@link CorsairProvider}. */
export type CorsairProviderProps = {
	/**
	 * Base URL of your Corsair management handler — the route that runs
	 * `createCorsairHandler`. Defaults to `/api/corsair`. Override it when the
	 * handler is mounted elsewhere or on a separate origin.
	 */
	baseURL?: string;
	/** Dialog theme: `'light'`, `'dark'`, or `'auto'` (the default, which follows
	 * the OS color scheme). Also accepts the object form `{ theme }`. */
	appearance?: ConnectAppearance;
	/**
	 * Called once after a successful connect. Wire this to `router.refresh()` in
	 * Next.js so server reads that failed with auth-missing re-run against the
	 * now-connected account. Mutations resume on their own via `call`.
	 */
	onConnected?: () => void;
	/**
	 * Auto-open the dialog when an unwrapped client call rejects with a Corsair
	 * auth-missing error — no `call` wrapper needed at the call site. On by
	 * default; set `false` to opt out and drive the dialog only through `call`,
	 * `connect`, and the error boundary. Note this opens the dialog but can't
	 * resume the original work (use `call` when you want auto-resume).
	 */
	captureUnhandled?: boolean;
	children: ReactNode;
};

/**
 * App-wide provider for Corsair Connect — wrap your app once at the root. When a
 * Corsair call fails because the tenant hasn't connected a plugin, the provider
 * surfaces a connect dialog and waits for the user to finish.
 *
 * A client call that rejects with an auth-missing error opens the dialog on its
 * own — no `call` wrapper needed (see `captureUnhandled`). Pair it with
 * {@link CorsairErrorBoundary} (a Next `error.tsx`) for server-read regions, and
 * reach for {@link useConnections}'s `call` only when a mutation should also
 * auto-resume after connect.
 */
export function CorsairProvider({
	baseURL,
	appearance,
	onConnected,
	captureUnhandled,
	children,
}: CorsairProviderProps): ReactElement {
	const clientRef = useRef<CorsairManagementClient | null>(null);
	if (!clientRef.current) {
		clientRef.current = createCorsairClient({
			baseURL: baseURL ?? '/api/corsair',
		});
	}
	const client = clientRef.current;

	const [connectState, dispatch] = useReducer(
		connectReducer,
		initialConnectState,
	);

	// Provider-owned connection status: fetched once on mount and refetched after
	// every successful connect, so every `useConnections()` reads one source and
	// flips to connected without the caller wiring a refetch.
	const [connections, setConnections] = useState<ConnectionStatus | null>(null);
	const [connectionsLoading, setConnectionsLoading] = useState(true);
	// Monotonic token: only the latest fetch may write, so an earlier slow request
	// can't clobber a newer one (mount fetch racing a post-connect refetch).
	const connFetchRef = useRef(0);
	const refreshConnections = useCallback(() => {
		const token = ++connFetchRef.current;
		setConnectionsLoading(true);
		client.connectionStatus
			.get()
			.then((s) => {
				if (token === connFetchRef.current) setConnections(s);
			})
			.catch(() => {})
			.finally(() => {
				if (token === connFetchRef.current) setConnectionsLoading(false);
			});
	}, [client]);
	useEffect(() => {
		refreshConnections();
	}, [refreshConnections]);

	const waitersRef = useRef<ConnectWaiters | null>(null);
	if (!waitersRef.current) waitersRef.current = createConnectWaiters();
	const waiters = waitersRef.current;
	const popupRef = useRef<Window | null>(null);
	const watchRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const graceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	// Bumped on every open and close so an in-flight poll from a superseded or
	// closed attempt can't settle the current one.
	const attemptRef = useRef(0);
	const onConnectedRef = useRef(onConnected);
	onConnectedRef.current = onConnected;
	// Synchronous mirror so callbacks don't read stale state.
	const connectStateRef = useRef(connectState);
	connectStateRef.current = connectState;

	const stopWatch = useCallback(() => {
		if (watchRef.current) {
			clearInterval(watchRef.current);
			watchRef.current = null;
		}
	}, []);

	const settle = useCallback(
		(ok: boolean) => {
			stopWatch();
			waiters.settleAll(ok);
		},
		[stopWatch, waiters],
	);

	// Poll the app's own backend while the popup is open — the universal
	// completion signal (works self-hosted and for custom connect pages). On
	// connect: clear the request, let the host refresh, resume any waiter.
	const beginWatch = useCallback(
		(plugin: string, tenantId: string | null) => {
			stopWatch();
			// A reopen must cancel the previous flow's pending grace + invalidate its
			// in-flight polls, or that stale confirmation cancels the new popup.
			if (graceRef.current) {
				clearTimeout(graceRef.current);
				graceRef.current = null;
			}
			attemptRef.current += 1;
			const attempt = attemptRef.current;
			// Clear only this plugin's request — a sibling plugin's pending prompt
			// must survive dismissing or completing this one.
			const scope = tenantId ? { tenantId, plugin } : { plugin };
			const statusScope = tenantId ? { tenantId } : undefined;
			// Guard every settle: the poll must still belong to this attempt and a
			// caller must still be waiting. Bumping the attempt makes it single-shot.
			const isCurrent = () =>
				attempt === attemptRef.current && waiters.size() > 0;
			const finishConnected = () => {
				attemptRef.current += 1;
				popupRef.current?.close();
				popupRef.current = null;
				dispatch({ type: 'SUCCESS' });
				client.connectRequest.clear(scope).catch(() => {});
				onConnectedRef.current?.();
				refreshConnections();
				settle(true);
			};
			const finishCancelled = () => {
				attemptRef.current += 1;
				popupRef.current?.close();
				popupRef.current = null;
				client.connectRequest.clear(scope).catch(() => {});
				dispatch({ type: 'CLOSE' });
				settle(false);
			};
			const check = () => {
				client.connectionStatus
					.get(statusScope)
					.then((status) => {
						if (
							isCurrent() &&
							shouldSettleConnected({
								capturedAttempt: attempt,
								currentAttempt: attemptRef.current,
								status,
								plugin,
							})
						) {
							finishConnected();
						}
					})
					.catch(() => {});
			};
			watchRef.current = setInterval(() => {
				check();
				// Popup gone — the user closed it, or the success page self-closed.
				// After the grace window, decide with one authoritative check rather
				// than assume a cancel: the success page closes the popup only once the
				// connection persisted, so a slow final poll must not discard success.
				if (popupRef.current?.closed) {
					stopWatch();
					graceRef.current = setTimeout(() => {
						if (!isCurrent()) return;
						// A slow or flaky final poll must not discard a real connection, so
						// confirm across a few retries before reading a closed popup as a
						// cancel (see confirmConnected).
						confirmConnected(
							() => client.connectionStatus.get(statusScope),
							plugin,
						).then((connected) => {
							if (!isCurrent()) return;
							if (connected) finishConnected();
							else finishCancelled();
						});
					}, POPUP_CLOSE_GRACE_MS);
				}
			}, WATCH_INTERVAL_MS);
		},
		[client, settle, stopWatch, refreshConnections],
	);

	const openDialog = useCallback(
		(
			plugin: string,
			connectUrl: string,
			tenantId: string | null,
		): Promise<boolean> => {
			if (
				shouldCoalesceConnect(
					connectStateRef.current,
					plugin,
					tenantId,
					waiters.size() > 0,
				)
			) {
				return new Promise<boolean>((resolve) => waiters.add(resolve));
			}
			attemptRef.current += 1;
			waiters.settleAll(false);
			dispatch({ type: 'OPEN', plugin, connectUrl, tenantId });
			return new Promise<boolean>((resolve) => waiters.add(resolve));
		},
		[waiters],
	);

	const connect = useCallback(
		async (plugin: string, opts?: { tenantId?: string }): Promise<boolean> => {
			// Scope to the tenant the link resolved (defaults to 'default'), not the
			// raw opt — so it matches the reactive path and coalesces symmetrically.
			const { connectUrl, tenantId } = await client.connect.createLink({
				plugin,
				tenantId: opts?.tenantId,
			});
			return openDialog(plugin, connectUrl, tenantId);
		},
		[client, openDialog],
	);

	// Reactive path: scope to the tenant the server resolved the request under, so
	// a concurrent proactive flow coalesces only when it targets that same tenant.
	const requireConnect =
		useCallback(async (): Promise<RequireConnectOutcome> => {
			const { request } = await client.connectRequest.get();
			if (!request) return 'none';
			const ok = await openDialog(
				request.plugin,
				request.connectUrl,
				request.tenantId,
			);
			return ok ? 'connected' : 'cancelled';
		}, [client, openDialog]);

	// Opt-in mutation wrapper: run the action; on failure, if a connect-request is
	// pending, open the dialog and re-run once connected — otherwise rethrow. The
	// server records that request across the RSC boundary where the typed error is
	// lost, so this can't classify the error itself; wrap only connect-gated or
	// retry-safe mutations.
	const call = useCallback(
		async <T,>(fn: () => Promise<T>): Promise<T | null> => {
			try {
				return await fn();
			} catch (err) {
				const outcome = await requireConnect();
				if (outcome === 'none') throw err;
				if (outcome === 'cancelled') return null;
				return await retryAfterConnect(fn);
			}
		},
		[requireConnect],
	);

	// User clicked "Connect" — open Hub's page in a popup and start watching.
	const handleOpen = useCallback(() => {
		const { connectUrl, plugin, tenantId } = connectState;
		if (!connectUrl || !plugin) return;
		// Mark the open as provider-initiated so the Hub connect page forwards
		// straight to sign-in. Cold links (grid, email, pasted) lack it and land
		// on the connect page instead.
		let openUrl = connectUrl;
		try {
			const u = new URL(connectUrl);
			u.searchParams.set('forward', '1');
			openUrl = u.toString();
		} catch {}
		const popup = window.open(
			openUrl,
			'corsair-connect',
			'width=520,height=720',
		);
		if (!popup) {
			// Popup blocked — there's no window to watch, so end the attempt instead
			// of leaving connect() pending forever. The caller can retry once the
			// user allows popups.
			attemptRef.current += 1;
			settle(false);
			dispatch({ type: 'CLOSE' });
			return;
		}
		popupRef.current = popup;
		beginWatch(plugin, tenantId);
	}, [beginWatch, connectState, settle]);

	const handleClose = useCallback(() => {
		attemptRef.current += 1;
		popupRef.current?.close();
		popupRef.current = null;
		// Clear only the plugin whose dialog is showing — sibling prompts survive.
		const scope = connectState.plugin
			? connectState.tenantId
				? { tenantId: connectState.tenantId, plugin: connectState.plugin }
				: { plugin: connectState.plugin }
			: undefined;
		client.connectRequest.clear(scope).catch(() => {});
		settle(false);
		dispatch({ type: 'CLOSE' });
	}, [client, settle, connectState.tenantId, connectState.plugin]);

	// Unmount mid-flow: stop the timers, invalidate any in-flight poll, close the
	// popup, and resolve a waiting caller so its promise can't hang forever.
	useEffect(
		() => () => {
			stopWatch();
			if (graceRef.current) clearTimeout(graceRef.current);
			attemptRef.current += 1;
			popupRef.current?.close();
			popupRef.current = null;
			waiters.settleAll(false);
		},
		[stopWatch, waiters],
	);

	// Hold the "connected" check briefly, then dismiss — the resolved call has
	// already resumed, so the success card is just a confirmation.
	useEffect(() => {
		if (connectState.phase !== 'success') return;
		const t = setTimeout(() => dispatch({ type: 'CLOSE' }), 1100);
		return () => clearTimeout(t);
	}, [connectState.phase]);

	// Global auto-prompt: an unwrapped client call that rejects with a Corsair
	// auth-missing error opens the dialog without a `call` wrapper. Wrapped calls
	// are caught by `call` and never surface here, so there's no double-prompt.
	useEffect(() => {
		if (captureUnhandled === false) return;
		const onRejection = (event: PromiseRejectionEvent) => {
			if (!isConnectError(event.reason)) return;
			if (connectStateRef.current.phase !== 'idle') return;
			// Known connect error — take over from the framework's error overlay.
			event.preventDefault();
			void requireConnect();
		};
		window.addEventListener('unhandledrejection', onRejection);
		return () => window.removeEventListener('unhandledrejection', onRejection);
	}, [captureUnhandled, requireConnect]);

	const value = useMemo<CorsairContextValue>(
		() => ({
			client,
			connect,
			call,
			requireConnect,
			connections,
			connectionsLoading,
			refreshConnections,
		}),
		[
			client,
			connect,
			call,
			requireConnect,
			connections,
			connectionsLoading,
			refreshConnections,
		],
	);

	const overlayOpen =
		connectState.phase === 'connecting' || connectState.phase === 'success';

	return (
		<CorsairContext.Provider value={value}>
			{children}
			{overlayOpen ? (
				<ConnectOverlay
					state={connectState}
					client={client}
					appearance={appearance}
					onOpen={handleOpen}
					onClose={handleClose}
				/>
			) : null}
		</CorsairContext.Provider>
	);
}

/**
 * Internal accessor for the raw Corsair Connect context — the management client
 * plus the connect/call API and the bits {@link CorsairErrorBoundary} relies on.
 * Not part of the public surface; app code uses {@link useConnections}. Throws if
 * used outside {@link CorsairProvider}.
 */
export function useCorsair(): CorsairContextValue {
	const ctx = useContext(CorsairContext);
	if (!ctx) {
		throw new Error('useConnections must be used within <CorsairProvider>');
	}
	return ctx;
}

/** Return value of {@link useConnections}. */
export type UseConnectionsResult = {
	/** Per-plugin connection status for the default scope, e.g.
	 * `{ linear: 'connected' }` — `null` until the first fetch resolves. Refreshes
	 * itself after every successful `connect` or `call`. */
	connections: ConnectionStatus | null;
	/** `true` if the given plugin has a usable credential. Convenience over
	 * `connections?.[plugin] === 'connected'`; `false` while status is loading. */
	isConnected: (plugin: string) => boolean;
	/** `true` while the first connection-status fetch is in flight. Render a
	 * placeholder rather than flash a "Connect" button that may already be done. */
	loading: boolean;
	/** Proactively open the dialog for a plugin (e.g. a "Connect GitHub" button),
	 * before any call has failed. Resolves `true` once connected. */
	connect: (plugin: string, opts?: { tenantId?: string }) => Promise<boolean>;
	/** Run a connect-gated mutation; if it fails while a connect-request is
	 * pending, open the dialog and re-run once connected. Resolves `null` if the
	 * user cancels, and rethrows the original error when nothing is pending. Wrap
	 * only connect-gated or retry-safe mutations. */
	call: <T>(fn: () => Promise<T>) => Promise<T | null>;
};

/**
 * The everyday hook into Corsair Connect. Reads this user's connection status
 * (`connections` / `isConnected`) and drives the connect flow: `connect` for a
 * proactive "Connect X" button, `call` to wrap a mutation so it auto-resumes
 * after connect. Status refreshes itself on every successful connect. Server
 * read regions gate through {@link CorsairErrorBoundary} (a Next `error.tsx`).
 */
export function useConnections(): UseConnectionsResult {
	const { connect, call, connections, connectionsLoading } = useCorsair();
	const isConnected = useCallback(
		(plugin: string) => connections?.[plugin] === 'connected',
		[connections],
	);
	return {
		connections,
		isConnected,
		loading: connectionsLoading,
		connect,
		call,
	};
}
