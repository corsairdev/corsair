import type { ApifyMcpEndpoints } from '../index';
import { executeApifyMcpTool } from './shared';

export const searchApifyDocs: ApifyMcpEndpoints['searchApifyDocs'] = async (
	ctx,
	input,
) => {
	return executeApifyMcpTool(
		ctx,
		'apifymcp.docs.searchApifyDocs',
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
		'apifymcp.docs.fetchApifyDocs',
		'fetch-apify-docs',
		input,
		{},
	);
};
