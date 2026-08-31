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
import { createCorsairClient } from '../index';
import type { CorsairManagementClient } from '../types';
import type { ConnectState } from './connect-controller';
import {
	connectReducer,
	initialConnectState,
	isPluginConnected,
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
	/** Bumped on each successful connect so boundaries can reset and retry. */
	connectNonce: number;
	status: ConnectState;
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
	children: ReactNode;
};

/**
 * App-wide provider for Corsair Connect — wrap your app once at the root. When a
 * server-side Corsair call fails because the tenant hasn't connected a plugin,
 * the provider surfaces a connect dialog, waits for the user to finish, then
 * lets the failed work resume — no per-call code at any of the call sites.
 *
 * Pair it with {@link CorsairBoundary} around server-rendered read regions, and
 * with {@link useConnect}'s `call` to wrap mutations that should auto-resume.
 */
export function CorsairProvider({
	baseURL,
	appearance,
	onConnected,
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
	const [connectNonce, setConnectNonce] = useState(0);

	const resolveRef = useRef<((ok: boolean) => void) | null>(null);
	const popupRef = useRef<Window | null>(null);
	const watchRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const graceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	// Bumped on every open and close so an in-flight poll from a superseded or
	// closed attempt can't settle the current one.
	const attemptRef = useRef(0);
	const onConnectedRef = useRef(onConnected);
	onConnectedRef.current = onConnected;

	const stopWatch = useCallback(() => {
		if (watchRef.current) {
			clearInterval(watchRef.current);
			watchRef.current = null;
		}
	}, []);

	const settle = useCallback(
		(ok: boolean) => {
			stopWatch();
			resolveRef.current?.(ok);
			resolveRef.current = null;
		},
		[stopWatch],
	);

	// Poll the app's own backend while the popup is open — the universal
	// completion signal (works self-hosted and for custom connect pages). On
	// connect: clear the request, let the host refresh, resume any waiter.
	const beginWatch = useCallback(
		(plugin: string, tenantId: string | null) => {
			stopWatch();
			const attempt = attemptRef.current;
			const scope = tenantId ? { tenantId } : undefined;
			// Guard every settle: the poll must still belong to this attempt and a
			// caller must still be waiting. Bumping the attempt makes it single-shot.
			const isCurrent = () =>
				attempt === attemptRef.current && !!resolveRef.current;
			const finishConnected = () => {
				attemptRef.current += 1;
				popupRef.current?.close();
				popupRef.current = null;
				dispatch({ type: 'SUCCESS' });
				client.connectRequest.clear(scope).catch(() => {});
				onConnectedRef.current?.();
				setConnectNonce((n) => n + 1);
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
					.get(scope)
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
						client.connectionStatus
							.get(scope)
							.then((status) => {
								if (!isCurrent()) return;
								if (isPluginConnected(status, plugin)) finishConnected();
								else finishCancelled();
							})
							.catch(() => {
								if (isCurrent()) finishCancelled();
							});
					}, POPUP_CLOSE_GRACE_MS);
				}
			}, WATCH_INTERVAL_MS);
		},
		[client, settle, stopWatch],
	);

	const openDialog = useCallback(
		(
			plugin: string,
			connectUrl: string,
			tenantId: string | null,
		): Promise<boolean> => {
			attemptRef.current += 1;
			resolveRef.current?.(false);
			dispatch({ type: 'OPEN', plugin, connectUrl, tenantId });
			return new Promise<boolean>((resolve) => {
				resolveRef.current = resolve;
			});
		},
		[],
	);

	const connect = useCallback(
		async (plugin: string, opts?: { tenantId?: string }): Promise<boolean> => {
			const { connectUrl } = await client.connect.createLink({
				plugin,
				tenantId: opts?.tenantId,
			});
			return openDialog(plugin, connectUrl, opts?.tenantId ?? null);
		},
		[client, openDialog],
	);

	// Reactive path: the handler recorded the request under the resolved tenant,
	// so leave scoping to it (null) rather than guess a tenant here.
	const requireConnect =
		useCallback(async (): Promise<RequireConnectOutcome> => {
			const { request } = await client.connectRequest.get();
			if (!request) return 'none';
			const ok = await openDialog(request.plugin, request.connectUrl, null);
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
				return await fn();
			}
		},
		[requireConnect],
	);

	// User clicked "Connect" — open Hub's page in a popup and start watching.
	const handleOpen = useCallback(() => {
		const { connectUrl, plugin, tenantId } = connectState;
		if (!connectUrl || !plugin) return;
		const popup = window.open(
			connectUrl,
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
		const scope = connectState.tenantId
			? { tenantId: connectState.tenantId }
			: undefined;
		client.connectRequest.clear(scope).catch(() => {});
		settle(false);
		dispatch({ type: 'CLOSE' });
	}, [client, settle, connectState.tenantId]);

	// Unmount mid-flow: stop the timers, invalidate any in-flight poll, close the
	// popup, and resolve a waiting caller so its promise can't hang forever.
	useEffect(
		() => () => {
			stopWatch();
			if (graceRef.current) clearTimeout(graceRef.current);
			attemptRef.current += 1;
			popupRef.current?.close();
			popupRef.current = null;
			resolveRef.current?.(false);
			resolveRef.current = null;
		},
		[stopWatch],
	);

	// Hold the "connected" check briefly, then dismiss — the resolved call has
	// already resumed, so the success card is just a confirmation.
	useEffect(() => {
		if (connectState.phase !== 'success') return;
		const t = setTimeout(() => dispatch({ type: 'CLOSE' }), 1100);
		return () => clearTimeout(t);
	}, [connectState.phase]);

	const value = useMemo<CorsairContextValue>(
		() => ({
			client,
			connect,
			call,
			requireConnect,
			connectNonce,
			status: connectState,
		}),
		[client, connect, call, requireConnect, connectNonce, connectState],
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
 * Access the full Corsair Connect context — the management client plus the
 * connect/call/status API and the internals {@link CorsairBoundary} relies on.
 * Most components want {@link useConnect} instead; reach for this only when you
 * need the raw `client`. Throws if used outside {@link CorsairProvider}.
 */
export function useCorsair(): CorsairContextValue {
	const ctx = useContext(CorsairContext);
	if (!ctx) {
		throw new Error('useCorsair must be used within <CorsairProvider>');
	}
	return ctx;
}

/** Return value of {@link useConnect}. */
export type UseConnectResult = {
	/** Proactively open the dialog for a plugin (e.g. a "Connect GitHub" button),
	 * before any call has failed. Resolves `true` once connected. */
	connect: (plugin: string, opts?: { tenantId?: string }) => Promise<boolean>;
	/** Run a connect-gated mutation; if it fails while a connect-request is
	 * pending, open the dialog and re-run once connected. Resolves `null` if the
	 * user cancels, and rethrows the original error when nothing is pending. Wrap
	 * only connect-gated or retry-safe mutations. */
	call: <T>(fn: () => Promise<T>) => Promise<T | null>;
	/** Current dialog state, for driving your own connect UI if needed. */
	status: ConnectState;
};

/**
 * The everyday hook into Corsair Connect. Use `connect` for a proactive connect
 * button and `call` to wrap a mutation so it auto-resumes after connect. Server
 * read regions don't need this — wrap them in {@link CorsairBoundary} instead.
 */
export function useConnect(): UseConnectResult {
	const { connect, call, status } = useCorsair();
	return { connect, call, status };
}
