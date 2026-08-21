import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AgentsEndpoints } from './agents';
import { ApiKeysEndpoints } from './api-keys';
import { BrowserEndpoints } from './browser';
import { ConnectionsEndpoints } from './connections';
import { DashboardEndpoints } from './dashboard';
import { InputsEndpoints } from './inputs';
import { JobsEndpoints } from './jobs';
import { ListsEndpoints } from './lists';
import { ProjectsEndpoints } from './projects';
import { agentyRoutes } from './routes';
import { SchedulerEndpoints } from './scheduler';
import {
	AgentyEndpointInputSchemas,
	AgentyEndpointOutputSchemas,
} from './types';
import { UsersEndpoints } from './users';
import { WorkflowsEndpoints } from './workflows';

export const agentyEndpointsNested = {
	agents: AgentsEndpoints,
	apiKeys: ApiKeysEndpoints,
	browser: BrowserEndpoints,
	connections: ConnectionsEndpoints,
	dashboard: DashboardEndpoints,
	inputs: InputsEndpoints,
	jobs: JobsEndpoints,
	lists: ListsEndpoints,
	projects: ProjectsEndpoints,
	scheduler: SchedulerEndpoints,
	users: UsersEndpoints,
	workflows: WorkflowsEndpoints,
} as const;

export const agentyEndpointMeta = Object.fromEntries(
	agentyRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
	// Object.fromEntries loses the literal endpoint-meta shape; cast satisfies RequiredPluginEndpointMeta.
) as RequiredPluginEndpointMeta<typeof agentyEndpointsNested>;

export const agentyEndpointSchemas = Object.fromEntries(
	agentyRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: AgentyEndpointInputSchemas[route.key],
			output: AgentyEndpointOutputSchemas[route.key],
		},
	]),
);

export { AgentyEndpointInputSchemas, AgentyEndpointOutputSchemas };
export * from './routes';
export * from './types';
