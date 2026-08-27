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
} from 'react';
import { ReconnectRequiredError } from '../../core/auth/errors/reconnect-required';
import { createCorsairClient } from '../index';
import type { CorsairManagementClient } from '../types';
import type { ConnectState } from './connect-controller';
import {
	connectReducer,
	initialConnectState,
	isConnectedMessage,
	isPluginConnected,
	originOf,
} from './connect-controller';
import type { ConnectAppearance } from './connect-overlay';
import { ConnectOverlay } from './connect-overlay';

const WATCH_INTERVAL_MS = 2000;

export type CorsairContextValue = {
	client: CorsairManagementClient;
	/** Mint a fresh link and open the overlay. Resolves true once connected. */
	connect: (plugin: string, opts?: { tenantId?: string }) => Promise<boolean>;
	/** Open the overlay from a caught ReconnectRequiredError (reuses its link). */
	connectFromError: (error: unknown) => Promise<boolean>;
	connectState: ConnectState;
};

const CorsairContext = createContext<CorsairContextValue | null>(null);

export function CorsairProvider({
	baseURL,
	appearance,
	children,
}: {
	baseURL: string;
	appearance?: ConnectAppearance;
	children: ReactNode;
}): ReactElement {
	const clientRef = useRef<CorsairManagementClient | null>(null);
	if (!clientRef.current) {
		clientRef.current = createCorsairClient({ baseURL });
	}
	const client = clientRef.current;

	const [connectState, dispatch] = useReducer(
		connectReducer,
		initialConnectState,
	);

	const resolveRef = useRef<((ok: boolean) => void) | null>(null);
	const popupRef = useRef<Window | null>(null);
	const watchRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const messageHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);

	const stopWatch = useCallback(() => {
		if (watchRef.current) {
			clearInterval(watchRef.current);
			watchRef.current = null;
		}
		if (messageHandlerRef.current) {
			window.removeEventListener('message', messageHandlerRef.current);
			messageHandlerRef.current = null;
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

	// Learn when the connection lands. Status polling against the app's own
	// backend is the universal signal — it works self-hosted and for custom
	// connect pages. The popup closing triggers an immediate check; a postMessage
	// from the managed connect page is an instant fast-path. All converge here.
	const beginWatch = useCallback(
		(plugin: string, tenantId: string | null, trustedOrigin: string) => {
			stopWatch();
			const check = () => {
				client.connectionStatus
					.get(tenantId ? { tenantId } : undefined)
					.then((status) => {
						if (isPluginConnected(status, plugin)) {
							popupRef.current?.close();
							popupRef.current = null;
							dispatch({ type: 'SUCCESS' });
							settle(true);
						}
					})
					.catch(() => {});
			};
			const onMessage = (e: MessageEvent) => {
				if (isConnectedMessage(e.data, e.origin, trustedOrigin)) check();
			};
			window.addEventListener('message', onMessage);
			messageHandlerRef.current = onMessage;
			watchRef.current = setInterval(() => {
				check();
				// Popup gone without connecting → stop; the modal stays for a retry.
				if (popupRef.current?.closed) stopWatch();
			}, WATCH_INTERVAL_MS);
		},
		[client, settle, stopWatch],
	);

	const openOverlay = useCallback(
		(plugin: string, tenantId: string | null, connectUrl: string) => {
			resolveRef.current?.(false);
			dispatch({ type: 'OPEN', plugin, tenantId, connectUrl });
			return new Promise<boolean>((resolve) => {
				resolveRef.current = resolve;
			});
		},
		[],
	);

	const connect = useCallback(
		async (plugin: string, opts?: { tenantId?: string }): Promise<boolean> => {
			const tenantId = opts?.tenantId ?? null;
			const { connectUrl } = await client.connect.createLink({
				plugin,
				tenantId: tenantId ?? undefined,
			});
			return openOverlay(plugin, tenantId, connectUrl);
		},
		[client, openOverlay],
	);

	const connectFromError = useCallback(
		(error: unknown): Promise<boolean> => {
			if (
				!(error instanceof ReconnectRequiredError) ||
				!error.plugin ||
				!error.connectUrl
			) {
				return Promise.resolve(false);
			}
			return openOverlay(error.plugin, error.tenantId, error.connectUrl);
		},
		[openOverlay],
	);

	// User clicked "Connect" — open Hub's page in a popup and start watching.
	const handleOpen = useCallback(() => {
		const { connectUrl, plugin, tenantId } = connectState;
		if (!connectUrl || !plugin) return;
		popupRef.current = window.open(
			connectUrl,
			'corsair-connect',
			'width=520,height=720',
		);
		beginWatch(plugin, tenantId, originOf(connectUrl) ?? '');
	}, [beginWatch, connectState]);

	const handleClose = useCallback(() => {
		popupRef.current?.close();
		popupRef.current = null;
		settle(false);
		dispatch({ type: 'CLOSE' });
	}, [settle]);

	useEffect(() => stopWatch, [stopWatch]);

	const value = useMemo<CorsairContextValue>(
		() => ({ client, connect, connectFromError, connectState }),
		[client, connect, connectFromError, connectState],
	);

	const overlayOpen =
		connectState.phase === 'connecting' || connectState.phase === 'success';

	return (
		<CorsairContext.Provider value={value}>
			{children}
			{overlayOpen ? (
				<ConnectOverlay
					state={connectState}
					appearance={appearance}
					onOpen={handleOpen}
					onClose={handleClose}
				/>
			) : null}
		</CorsairContext.Provider>
	);
}

export function useCorsair(): CorsairContextValue {
	const ctx = useContext(CorsairContext);
	if (!ctx) {
		throw new Error('useCorsair must be used within <CorsairProvider>');
	}
	return ctx;
}

/** Open the connect overlay imperatively, or from a caught ReconnectRequiredError. */
export function useConnect(): {
	connect: (plugin: string, opts?: { tenantId?: string }) => Promise<boolean>;
	connectFromError: (error: unknown) => Promise<boolean>;
	state: ConnectState;
} {
	const { connect, connectFromError, connectState } = useCorsair();
	return { connect, connectFromError, state: connectState };
}
