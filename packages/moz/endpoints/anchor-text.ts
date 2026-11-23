import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/** Lists the anchor texts used to link to a target, with link counts. */
export const list: MozEndpoints['anchorTextList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'anchorText.list',
			input: Inputs.anchorTextList,
			output: Outputs.anchorTextList,
		},
		input,
		(parsed) => ({
			method: 'data.site.anchor-text.list',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				query: parsed.site_query.query,
				returned: result.anchor_texts.length,
				nextToken: result.offset.token ?? undefined,
			}),
		},
	);
