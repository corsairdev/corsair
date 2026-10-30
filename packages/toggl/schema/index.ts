import {
	TogglClientEntity,
	TogglProjectEntity,
	TogglTagEntity,
	TogglWorkspaceEntity,
} from './database';

export const TogglSchema = {
	version: '1.0.0',
	entities: {
		workspaces: TogglWorkspaceEntity,
		clients: TogglClientEntity,
		projects: TogglProjectEntity,
		tags: TogglTagEntity,
	},
} as const;
