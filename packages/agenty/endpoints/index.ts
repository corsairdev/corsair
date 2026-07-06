import { AgentsEndpoints } from './agents';
import { ApiKeysEndpoints } from './apiKeys';
import { BrowserEndpoints } from './browser';
import { ConnectionsEndpoints } from './connections';
import { DashboardEndpoints } from './dashboard';
import { InputsEndpoints } from './inputs';
import { JobsEndpoints } from './jobs';
import { ListsEndpoints } from './lists';
import { ProjectsEndpoints } from './projects';
import { SchedulerEndpoints } from './scheduler';
import { UsersEndpoints } from './users';
import { WorkflowsEndpoints } from './workflows';
import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { agentyRoutes } from './routes';
import { AgentyEndpointInputSchemas, AgentyEndpointOutputSchemas } from './types';

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
	workflows: WorkflowsEndpoints
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
