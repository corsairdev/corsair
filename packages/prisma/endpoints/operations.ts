import { backupsOperations } from '../operations/backups';
import { connectionsOperations } from '../operations/connections';
import { databasesOperations } from '../operations/databases';
import { integrationsOperations } from '../operations/integrations';
import { projectsOperations } from '../operations/projects';
import { regionsOperations } from '../operations/regions';
import { sqlOperations } from '../operations/sql';
import { workspacesOperations } from '../operations/workspaces';

export type {
	PrismaMethod,
	PrismaOperation,
	PrismaOperationKind,
} from './operation-types';

export const prismaOperations = [
	...workspacesOperations,
	...projectsOperations,
	...databasesOperations,
	...sqlOperations,
	...connectionsOperations,
	...backupsOperations,
	...regionsOperations,
	...integrationsOperations,
] as const;
