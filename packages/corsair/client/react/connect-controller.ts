import type { ConnectionStatus } from '../../core/management/types';
import type { RequireConnectOutcome } from './provider';

// State machine behind the connect overlay. Kept pure (no React) so the
// open → watch → settle flow is testable without a DOM.

export type ConnectPhase = 'idle' | 'connecting' | 'success';

export type ConnectState = {
	phase: ConnectPhase;
	plugin: string | null;
	connectUrl: string | null;
	// Explicit tenant for a proactive connect; null means the handler resolves it.
	tenantId: string | null;
};

export type ConnectAction =
	| {
			type: 'OPEN';
			plugin: string;
			connectUrl: string;
			tenantId: string | null;
	  }
	| { type: 'SUCCESS' }
	| { type: 'CLOSE' };

export const initialConnectState: ConnectState = {
	phase: 'idle',
	plugin: null,
	connectUrl: null,
	tenantId: null,
};

export function connectReducer(
	state: ConnectState,
	action: ConnectAction,
): ConnectState {
	switch (action.type) {
		case 'OPEN':
			return {
				phase: 'connecting',
				plugin: action.plugin,
				connectUrl: action.connectUrl,
				tenantId: action.tenantId,
			};
		case 'SUCCESS':
			return { ...state, phase: 'success' };
		case 'CLOSE':
			return initialConnectState;
	}
}

export function isPluginConnected(
	status: ConnectionStatus | null | undefined,
	plugin: string,
): boolean {
	return status?.[plugin] === 'connected';
}

// A status poll can resolve after its overlay closed or a new attempt began.
// Settle only when the poll still belongs to the current attempt and the plugin
// actually connected — otherwise a stale poll would resolve the wrong promise.
export function shouldSettleConnected(input: {
	capturedAttempt: number;
	currentAttempt: number;
	status: ConnectionStatus | null | undefined;
	plugin: string;
}): boolean {
	return (
		input.capturedAttempt === input.currentAttempt &&
		isPluginConnected(input.status, input.plugin)
	);
}

// Attempts after a successful connect before the resumed call gives up.
export const POST_CONNECT_RETRIES = 4;
export const POST_CONNECT_BACKOFF_MS = 250;

// The stored credential can lag the "connected" status by a beat, so the first
// resumed call may still hit auth-missing. Retry with linear backoff to ride out
// that propagation window; surface the last error if it never lands.
export async function retryAfterConnect<T>(
	fn: () => Promise<T>,
	opts?: {
		retries?: number;
		backoffMs?: number;
		sleep?: (ms: number) => Promise<void>;
	},
): Promise<T> {
	const retries = opts?.retries ?? POST_CONNECT_RETRIES;
	const backoffMs = opts?.backoffMs ?? POST_CONNECT_BACKOFF_MS;
	const sleep =
		opts?.sleep ?? ((ms) => new Promise<void>((r) => setTimeout(r, ms)));
	let lastErr: unknown;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn();
		} catch (err) {
			lastErr = err;
			if (attempt < retries) await sleep(backoffMs * (attempt + 1));
		}
	}
	throw lastErr;
}

// Attempts to confirm the connection once the popup closes.
export const POPUP_CLOSE_CONFIRM_RETRIES = 3;

// The success page closes the popup only after the connection persisted, so a
// closed popup nearly always means success. But the status endpoint can lag a
// beat, and a single final poll can fail transiently — treating either as a
// cancel discards a real connection. Poll a few times, returning connected as
// soon as any attempt confirms it and cancelled only once every attempt is
// exhausted (a thrown poll counts as "not yet", never an immediate cancel).
export async function confirmConnected(
	getStatus: () => Promise<ConnectionStatus | null | undefined>,
	plugin: string,
	opts?: {
		retries?: number;
		backoffMs?: number;
		sleep?: (ms: number) => Promise<void>;
	},
): Promise<boolean> {
	const retries = opts?.retries ?? POPUP_CLOSE_CONFIRM_RETRIES;
	const backoffMs = opts?.backoffMs ?? POST_CONNECT_BACKOFF_MS;
	const sleep =
		opts?.sleep ?? ((ms) => new Promise<void>((r) => setTimeout(r, ms)));
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			if (isPluginConnected(await getStatus(), plugin)) return true;
		} catch {
			// Transient poll failure — fall through and retry, don't cancel.
		}
		if (attempt < retries) await sleep(backoffMs * (attempt + 1));
	}
	return false;
}

// Recognise a Corsair auth-missing / reconnect failure from an unhandled
// rejection so the provider can auto-open the dialog without the call site
// wrapping anything. Matches the error markers, which survive the server-action
// boundary in dev (prod redacts the message, so global capture is best-effort
// there — reads still gate through the error boundary, mutations through call).
export function isConnectError(reason: unknown): boolean {
	if (reason == null) return false;
	const named = reason as { name?: unknown; message?: unknown };
	if (
		named.name === 'AuthMissingError' ||
		named.name === 'ReconnectRequiredError'
	)
		return true;
	const message =
		typeof reason === 'string'
			? reason
			: typeof named.message === 'string'
				? named.message
				: '';
	return (
		/\[auth-missing:/.test(message) || /\breconnect required\b/i.test(message)
	);
}

/** What a Corsair error boundary does once the caught read's connect flow settles. */
export type BoundaryAction = 'retry' | 'rethrow' | 'dismissed';

// A Server Component read error reaches error.tsx redacted, so the boundary asks
// the provider (requireConnect) instead of inspecting the error: a pending
// connect-request means auth-missing → connect then retry; nothing pending means
// a genuine error → rethrow; a closed dialog → dismissed.
export function resolveBoundaryAction(
	outcome: RequireConnectOutcome,
): BoundaryAction {
	switch (outcome) {
		case 'connected':
			return 'retry';
		case 'none':
			return 'rethrow';
		case 'cancelled':
			return 'dismissed';
	}
}

// Several callers can await one dialog; a lone resolver would drop all but the last.
export type ConnectWaiters = {
	add: (resolve: (ok: boolean) => void) => void;
	settleAll: (ok: boolean) => void;
	size: () => number;
};

export function createConnectWaiters(): ConnectWaiters {
	let waiters: Array<(ok: boolean) => void> = [];
	return {
		add: (resolve) => {
			waiters.push(resolve);
		},
		settleAll: (ok) => {
			const pending = waiters;
			waiters = [];
			for (const resolve of pending) resolve(ok);
		},
		size: () => waiters.length,
	};
}

// A second call joins the open flow only when that flow is still live (a caller
// is still waiting) and it targets the same plugin and tenant. Both paths supply
// the resolved tenant (the reactive path reads it back from the request), so a
// different tenant — or null-vs-concrete — supersedes.
//
// The liveness gate closes a race: finishConnected empties the waiters and stops
// the watch before React commits the success state, so for a beat the state ref
// still reads 'connecting'. `flowLive` (the waiter count) is the synchronous
// truth — without it a same-tenant call would join the settled flow and hang,
// since nothing settles waiters again.
export function shouldCoalesceConnect(
	state: ConnectState,
	plugin: string,
	tenantId: string | null,
	flowLive: boolean,
): boolean {
	if (!flowLive) return false;
	if (state.phase !== 'connecting' || state.plugin !== plugin) return false;
	return state.tenantId === tenantId;
}
