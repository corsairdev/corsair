import {
	ComposioConnectedAccount,
	ComposioSession,
	ComposioTool,
	ComposioToolkit,
} from './database';

export const ComposioSchema = {
	version: '1.0.0',
	entities: {
		tools: ComposioTool,
		toolkits: ComposioToolkit,
		connectedAccounts: ComposioConnectedAccount,
		sessions: ComposioSession,
	},
} as const;
