import type { ApifyMcpEndpoints } from '../index';
import { executeApifyMcpTool } from './shared';

export const searchActors: ApifyMcpEndpoints['searchActors'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apifymcp.actors.searchActors',
		'search-actors',
		input,
		{ cache: 'actors' },
	);
};

export const fetchActorDetails: ApifyMcpEndpoints['fetchActorDetails'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apifymcp.actors.fetchActorDetails',
		'fetch-actor-details',
		input,
		{ cache: 'actors' },
	);
};

export const callActor: ApifyMcpEndpoints['callActor'] = async (ctx, input) => {
	return executeApifyMcpTool(
		ctx,
		'apifymcp.actors.callActor',
		'call-actor',
		input,
		{ cache: 'actorRun', requireAuth: true },
	);
};

export const ragWebBrowser: ApifyMcpEndpoints['ragWebBrowser'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apifymcp.actors.ragWebBrowser',
		'apify/rag-web-browser',
		input,
		{ cache: 'actorRun', requireAuth: true },
	);
};
