import { ComposioConnection, ComposioTool, ComposioToolkit } from './database';

export const ComposioSchema = {
	version: '1.0.0',
	entities: {
		tools: ComposioTool,
		connections: ComposioConnection,
		toolkits: ComposioToolkit,
	},
} as const;
