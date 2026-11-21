import type { StannpEndpoints } from '..';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const validate: StannpEndpoints['addressesValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'addresses.validate',
			input: Inputs.addressesValidate,
			output: Outputs.addressesValidate,
		},
		input,
		(
			{
				company,
				address1,
				address2,
				address3,
				city,
				postcode,
				state,
				province,
				zipcode,
				country,
			},
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/addresses/validate',
			form: {
				company,
				address1,
				address2,
				address3,
				city,
				postcode,
				state,
				province,
				zipcode,
				country,
			},
		}),
		{
			// The address itself is the answer; a record of it adds nothing.
			log: (_, result) => ({ isValid: result.is_valid ?? undefined }),
		},
	);
