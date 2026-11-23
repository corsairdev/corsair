import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/** Lists every locale a search engine supports. Costs no rows. */
export const list: MozEndpoints['localesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'locales.list',
			input: Inputs.localesList,
			output: Outputs.localesList,
		},
		input,
		(parsed) => ({
			method: 'metadata.locale.list',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed) => ({ engine: parsed.engine }),
		},
	);
