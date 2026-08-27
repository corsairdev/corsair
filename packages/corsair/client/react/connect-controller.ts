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
