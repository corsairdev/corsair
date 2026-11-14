import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { compactQuery, makeCompanyEnrichRequest } from '../client';
import type { PositionsAutocompleteResponse } from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// Position / job-title suggestions (docs:
// https://docs.companyenrich.com/reference/get_v2-positions-autocomplete.md).

export const positionsAutocomplete: CompanyenrichEndpoints['positionsAutocomplete'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.positionsAutocomplete.parse(input);

		// Up to 10 suggestions ordered by popularity; no credits are deducted.
		const response =
			await makeCompanyEnrichRequest<PositionsAutocompleteResponse>(
				'/v2/positions/autocomplete',
				ctx.key,
				{
					method: 'GET',
					query: compactQuery({ query: parsedInput.query }),
				},
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.positionsAutocomplete.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.positions.autocomplete',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};
