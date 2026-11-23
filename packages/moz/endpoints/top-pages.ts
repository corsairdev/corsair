import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/** Lists a target's top pages sorted by authority or linking root domains. */
export const list: MozEndpoints['topPagesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'topPages.list',
			input: Inputs.topPagesList,
			output: Outputs.topPagesList,
		},
		input,
		(parsed) => ({
			method: 'data.site.top-page.list',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				query: parsed.site_query.query,
				scope: parsed.site_query.scope,
				returned: result.top_pages.length,
				nextToken: result.offset.token ?? undefined,
			}),
		},
	);
