import type { ConnectionStatus } from '../../core/management/types';

// State machine behind the connect overlay. Kept pure (no React) so the
// open → poll → resolve flow is testable without a DOM.

export type ConnectPhase = 'idle' | 'connecting' | 'success';

export type ConnectState = {
	phase: ConnectPhase;
	plugin: string | null;
	tenantId: string | null;
	connectUrl: string | null;
};

export type ConnectAction =
	| {
			type: 'OPEN';
			plugin: string;
			tenantId: string | null;
			connectUrl: string;
	  }
	| { type: 'SUCCESS' }
	| { type: 'CLOSE' };

export const initialConnectState: ConnectState = {
	phase: 'idle',
	plugin: null,
	tenantId: null,
	connectUrl: null,
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
				tenantId: action.tenantId,
				connectUrl: action.connectUrl,
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

export const CONNECTED_MESSAGE_TYPE = 'corsair:connected';

// Instant "done" signal the managed connect page posts to its opener. Trusted
// only from the connect link's own origin — a self-hosted or custom page that
// never posts it simply falls back to status polling, so nothing breaks.
export function isConnectedMessage(
	data: unknown,
	origin: string,
	trustedOrigin: string,
): boolean {
	return (
		trustedOrigin.length > 0 &&
		origin === trustedOrigin &&
		typeof data === 'object' &&
		data !== null &&
		(data as { type?: unknown }).type === CONNECTED_MESSAGE_TYPE
	);
}

export function originOf(url: string): string | null {
	try {
		return new URL(url).origin;
	} catch {
		return null;
	}
}
