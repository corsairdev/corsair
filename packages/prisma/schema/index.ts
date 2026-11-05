import {
	PrismaBackup,
	PrismaConnection,
	PrismaDatabase,
	PrismaIntegration,
	PrismaProject,
	PrismaRegion,
	PrismaWorkspace,
} from './database';

export const PrismaSchema = {
	version: '1.0.0',
	entities: {
		workspaces: PrismaWorkspace,
		projects: PrismaProject,
		databases: PrismaDatabase,
		connections: PrismaConnection,
		backups: PrismaBackup,
		regions: PrismaRegion,
		integrations: PrismaIntegration,
	},
} as const;
