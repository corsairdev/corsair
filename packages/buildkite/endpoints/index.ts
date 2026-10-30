import { getCurrentAccessToken } from './get-current-access-token';
import { getMeta } from './get-meta';
import { getUser } from './get-user';
import { listOrganizations } from './list-organizations';
import { listPipelineAgents } from './list-pipeline-agents';

export const BuildkiteEndpointsImpl = {
	getCurrentAccessToken,
	getMeta,
	getUser,
	listOrganizations,
	listPipelineAgents,
};

export * from './types';
