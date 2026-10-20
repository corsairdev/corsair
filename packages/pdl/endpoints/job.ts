import type { PdlEndpoints } from '..';
import { makePDLRequest } from '../client';
import { callPdl } from './call';
import { PdlEndpointInputSchemas, PdlEndpointOutputSchemas } from './types';

export const search: PdlEndpoints['jobSearch'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.job.search',
		PdlEndpointInputSchemas.jobSearch,
		PdlEndpointOutputSchemas.jobSearch,
		input,
		(validated) =>
			makePDLRequest('/v5/job_posting/search', ctx.key, {
				method: 'POST',
				body: validated,
				baseUrl: ctx.options?.baseUrl,
			}),
		(_validated, response) => ({
			total: response.total,
			resultCount: response.data.length,
			hasMore: response.scroll_token !== undefined,
		}),
	);
};
