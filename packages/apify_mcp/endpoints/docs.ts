import type { ApifyMcpEndpoints } from '../index';
import { executeApifyMcpTool } from './shared';

export const searchApifyDocs: ApifyMcpEndpoints['searchApifyDocs'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apify_mcp.docs.searchApifyDocs',
		'search-apify-docs',
		input,
		{},
	);
};

export const fetchApifyDocs: ApifyMcpEndpoints['fetchApifyDocs'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apify_mcp.docs.fetchApifyDocs',
		'fetch-apify-docs',
		input,
		{},
	);
};
