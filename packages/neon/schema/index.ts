import {
	NeonProject,
	NeonBranch,
	NeonDatabase,
	NeonRole,
} from './database';

export const NeonSchema = {
	version: '1.0.0',
	entities: {
		projects: NeonProject,
		branches: NeonBranch,
		databases: NeonDatabase,
		roles: NeonRole,
	},
} as const;
