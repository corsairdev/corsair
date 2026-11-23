import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/** Lists the links pointing at a target, one page at a time. */
export const list: MozEndpoints['linksList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.list',
			input: Inputs.linksList,
			output: Outputs.linksList,
		},
		input,
		(parsed) => ({
			method: 'data.site.link.list',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				query: parsed.site_query.query,
				scope: parsed.site_query.scope,
				returned: result.links.length,
				// undefined when there is no next page; LogFields rejects null.
				nextToken: result.offset.token ?? undefined,
			}),
		},
	);

/**
 * Fetches the sources that link to some targets but not others. Costs one row
 * per result per target in the request.
 */
export const intersect: MozEndpoints['linksIntersect'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'links.intersect',
			input: Inputs.linksIntersect,
			output: Outputs.linksIntersect,
		},
		input,
		(parsed) => ({
			method: 'data.site.link.intersect.fetch',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				targets:
					parsed.is_linking_to.length + (parsed.not_linking_to?.length ?? 0),
				returned: result.link_intersects.length,
				nextToken: result.offset.token ?? undefined,
			}),
		},
	);
