import type { Search1APIEndpoints } from '..';
import { makeSearch1APIRequest } from '../client';
import { callSearch1API } from './call';
import {
	Search1APIEndpointInputSchemas,
	Search1APIEndpointOutputSchemas,
} from './types';

export const start: Search1APIEndpoints['deepcrawlStart'] = async (
	ctx,
	input,
) => {
	return callSearch1API(
		ctx,
		'search1api.deepcrawl.start',
		Search1APIEndpointInputSchemas.deepcrawlStart,
		Search1APIEndpointOutputSchemas.deepcrawlStart,
		input,
		(validated) =>
			makeSearch1APIRequest('/deepcrawl', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			url: validated.url,
			taskId: response.taskId,
			status: response.status,
		}),
	);
};

export const status: Search1APIEndpoints['deepcrawlStatus'] = async (
	ctx,
	input,
) => {
	return callSearch1API(
		ctx,
		'search1api.deepcrawl.status',
		Search1APIEndpointInputSchemas.deepcrawlStatus,
		Search1APIEndpointOutputSchemas.deepcrawlStatus,
		input,
		(validated) =>
			makeSearch1APIRequest(
				`/deepcrawl/status/${encodeURIComponent(validated.taskId)}`,
				ctx.key,
				{ method: 'GET' },
			),
		(_validated, response) => ({
			taskId: response.taskId,
			status: response.status,
			hasZip: Boolean(response.zipUrl),
		}),
	);
};
