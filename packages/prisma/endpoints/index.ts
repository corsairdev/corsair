import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { BackupsEndpoints } from './backups';
import { ConnectionsEndpoints } from './connections';
import { DatabasesEndpoints } from './databases';
import { IntegrationsEndpoints } from './integrations';
import type { PrismaOperation } from './operations';
import { prismaOperations } from './operations';
import { ProjectsEndpoints } from './projects';
import { RegionsEndpoints } from './regions';
import { SqlEndpoints } from './sql';
import {
	PrismaEndpointInputSchemas,
	PrismaEndpointOutputSchemas,
} from './types';
import { WorkspacesEndpoints } from './workspaces';

export const prismaEndpointsNested = {
	workspaces: WorkspacesEndpoints,
	projects: ProjectsEndpoints,
	databases: DatabasesEndpoints,
	sql: SqlEndpoints,
	connections: ConnectionsEndpoints,
	backups: BackupsEndpoints,
	regions: RegionsEndpoints,
	integrations: IntegrationsEndpoints,
} as const;

// Object.fromEntries widens keys to string; assert to the meta map keyed
// by nested endpoint paths, which the entries mirror 1:1 (every operation
// in prismaOperations has a matching handler, verified by api.test.ts)
export const prismaEndpointMeta = Object.fromEntries(
	prismaOperations.map((operation: PrismaOperation) => [
		`${operation.group}.${operation.name}`,
		{
			riskLevel: operation.riskLevel,
			irreversible: operation.irreversible,
			description: operation.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof prismaEndpointsNested>;

export const prismaEndpointSchemas = Object.fromEntries(
	prismaOperations.map((operation: PrismaOperation) => [
		`${operation.group}.${operation.name}`,
		{
			input: PrismaEndpointInputSchemas[operation.key],
			output: PrismaEndpointOutputSchemas[operation.key],
		},
	]),
);

export * from './operations';
export * from './types';
export {
	PrismaEndpointInputSchemas,
	PrismaEndpointOutputSchemas,
} from './types';
