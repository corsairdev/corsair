import type { MoneybirdEndpoints } from '..';
import { call } from './call';
import {
	MoneybirdEndpointInputSchemas as Inputs,
	MoneybirdEndpointOutputSchemas as Outputs,
} from './types';

/** Lists the administrations the token can access; needs no administration id. */
export const list: MoneybirdEndpoints['administrationsList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'administrations.list',
			input: Inputs.administrationsList,
			output: Outputs.administrationsList,
		},
		input,
		() => ({
			// The administrations resource sits above the administration scope.
			global: true,
			replayable: true,
			method: 'GET',
			path: '/administrations.json',
		}),
		{
			shape: (raw) => ({ administrations: raw }),
			log: (_, result) => ({ administrations: result.administrations.length }),
		},
	);
