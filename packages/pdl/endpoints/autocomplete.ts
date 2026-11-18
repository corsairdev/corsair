import type { PdlEndpoints } from '..';
import { makePDLRequest, pdlQuery } from '../client';
import { callPdl } from './call';
import { PdlEndpointInputSchemas, PdlEndpointOutputSchemas } from './types';

export const suggest: PdlEndpoints['autocomplete'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.autocomplete.suggest',
		PdlEndpointInputSchemas.autocomplete,
		PdlEndpointOutputSchemas.autocomplete,
		input,
		(validated) =>
			makePDLRequest('/v5/autocomplete', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			}),
		(validated, response) => ({
			field: validated.field,
			suggestionCount: response.data.length,
		}),
	);
};
