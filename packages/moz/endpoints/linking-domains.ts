import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/** Lists the root domains linking to a target with aggregate link counts. */
export const list: MozEndpoints['linkingDomainsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'linkingDomains.list',
			input: Inputs.linkingDomainsList,
			output: Outputs.linkingDomainsList,
		},
		input,
		(parsed) => ({
			method: 'data.site.linking-domain.list',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				query: parsed.site_query.query,
				returned: result.linking_domains.length,
				nextToken: result.offset.token ?? undefined,
			}),
		},
	);
