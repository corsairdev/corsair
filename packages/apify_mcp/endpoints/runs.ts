import type { ApifyMcpEndpoints } from '../index';
import { executeApifyMcpTool } from './shared';

export const getActorRun: ApifyMcpEndpoints['getActorRun'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apify_mcp.runs.getActorRun',
		'get-actor-run',
		input,
		{ cache: 'actorRun', requireAuth: true },
	);
};

export const getActorOutput: ApifyMcpEndpoints['getActorOutput'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apify_mcp.runs.getActorOutput',
		'get-actor-output',
		input,
		{ cache: 'actorOutput', datasetId: input.datasetId, requireAuth: true },
	);
};
