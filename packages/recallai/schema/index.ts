import { RecallaiWorkspaceSchema } from './database';

export const RecallaiSchema = {
	version: '1.0.0',
	entities: {
		recallaiWorkspace: RecallaiWorkspaceSchema,
	},
} as const;
