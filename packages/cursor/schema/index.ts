import {
	CursorAgent,
	CursorApiKey,
	CursorModel,
	CursorRepository,
} from './database';

export const CursorSchema = {
	version: '1.0.0',
	entities: {
		agents: CursorAgent,
		repositories: CursorRepository,
		models: CursorModel,
		apiKeys: CursorApiKey,
	},
} as const;
