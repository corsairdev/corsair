import type { ApifyMcpEndpoints } from '../index';
import { executeApifyMcpTool } from './shared';

export const getActorRun: ApifyMcpEndpoints['getActorRun'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apify.runs.getActorRun',
		'get-actor-run',
		input,
		{ cache: 'actorRun', requireAuth: true },
	);
};

export const getActorOutput: ApifyMcpEndpoints['getActorOutput'] = async (
	ctx,
	input,
) => {
	// Hosted Apify MCP tool is get-dataset-items (get-actor-output was removed).
	return executeApifyMcpTool(
		ctx,
		'apify.runs.getActorOutput',
		'get-dataset-items',
		input,
		{ cache: 'actorOutput', datasetId: input.datasetId, requireAuth: true },
	);
};
