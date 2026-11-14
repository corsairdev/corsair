import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { compactQuery, makeCompanyEnrichRequest } from '../client';
import type { TechnologiesAutocompleteResponse } from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// Technology suggestions (docs:
// https://docs.companyenrich.com/reference/get_v2-technologies-autocomplete.md).

export const technologiesAutocomplete: CompanyenrichEndpoints['technologiesAutocomplete'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.technologiesAutocomplete.parse(input);

		// Up to 10 suggestions ordered by popularity; no credits are deducted.
		const response =
			await makeCompanyEnrichRequest<TechnologiesAutocompleteResponse>(
				'/v2/technologies/autocomplete',
				ctx.key,
				{
					method: 'GET',
					query: compactQuery({ query: parsedInput.query }),
				},
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.technologiesAutocomplete.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'companyenrich.technologies.autocomplete',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};
