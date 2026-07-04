import { ComposioTool, ComposioConnection, ComposioAction } from './database';

export const ComposioSchema = {
	version: '1.0.0',
	entities: {
		tools: ComposioTool,
		connections: ComposioConnection,
		actions: ComposioAction,
	},
} as const;
