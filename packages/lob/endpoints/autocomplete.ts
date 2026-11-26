import type { LobEndpoints } from '..';
import { call } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './types';

export const usAutocomplete: LobEndpoints['autocompleteUsAutocomplete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'autocomplete.usAutocomplete',
			input: Inputs.autocompleteUsAutocomplete,
			output: Outputs.autocompleteUsAutocomplete,
		},
		input,
		({
			address_prefix,
			city,
			state,
			zip_code,
			geo_ip_sort,
			case: casing,
			valid_addresses,
		}) => ({
			method: 'POST',
			path: '/us_autocompletions',
			body: { address_prefix, city, state, zip_code, geo_ip_sort },
			query: { case: casing, valid_addresses },
		}),
		{
			log: (_, result) => ({ suggestions: result.suggestions.length }),
		},
	);
