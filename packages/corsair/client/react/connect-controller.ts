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
