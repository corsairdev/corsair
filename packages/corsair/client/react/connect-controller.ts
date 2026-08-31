import type { ConnectionStatus } from '../../core/management/types';

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
