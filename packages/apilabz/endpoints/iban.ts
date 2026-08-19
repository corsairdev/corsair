import type { ApiLabzEndpoints } from '..';
import { executeApiLabzModule } from './shared';
import {
	ApiLabzEndpointInputSchemas,
	ApiLabzEndpointOutputSchemas,
} from './types';

/** Validates an IBAN (API_LABZ_IBAN_VALIDATOR → hub module 113). */
export const validate: ApiLabzEndpoints['ibanValidate'] = async (
	ctx,
	input,
) => {
	const parsedInput = ApiLabzEndpointInputSchemas.ibanValidate.parse(input);
	return executeApiLabzModule(
		ctx,
		'apilabz.iban.validate',
		'ibanValidate',
		parsedInput,
		ApiLabzEndpointOutputSchemas.ibanValidate,
	);
};
