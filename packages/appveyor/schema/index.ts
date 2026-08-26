import { AppVeyorBuild, AppVeyorProject } from './database';

export const AppVeyorSchema = {
	version: '1.0.0',
	entities: {
		projects: AppVeyorProject,
		builds: AppVeyorBuild,
	},
} as const;
