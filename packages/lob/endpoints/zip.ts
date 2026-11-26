import type { LobEndpoints } from '..';
import { call } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './registry';

export const usZipLookup: LobEndpoints['zipUsZipLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'zip.usZipLookup',
			input: Inputs.zipUsZipLookup,
			output: Outputs.zipUsZipLookup,
		},
		input,
		({ zip_code }) => ({
			method: 'POST',
			path: '/us_zip_lookups',
			body: { zip_code },
		}),
		{
			log: (_, result) => ({ cities: result.cities.length }),
		},
	);
