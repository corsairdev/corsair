import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { compactQuery, makeCompanyEnrichRequest } from '../client';
import type { KeywordsAutocompleteResponse } from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// Keyword suggestions (docs:
// https://docs.companyenrich.com/reference/get_v2-keywords-autocomplete.md).

export const keywordsAutocomplete: CompanyenrichEndpoints['keywordsAutocomplete'] =
	async (ctx, input) => {
		const parsedInput =
			CompanyenrichEndpointInputSchemas.keywordsAutocomplete.parse(input);

		// Up to 10 suggestions ordered by popularity; no credits are deducted.
		const response =
			await makeCompanyEnrichRequest<KeywordsAutocompleteResponse>(
				'/v2/keywords/autocomplete',
				ctx.key,
				{
					method: 'GET',
					query: compactQuery({ query: parsedInput.query }),
				},
			);

		const parsed =
			CompanyenrichEndpointOutputSchemas.keywordsAutocomplete.parse(response);

		await logEventFromContext(
			ctx,
			'companyenrich.keywords.autocomplete',
			{ count: parsed.items.length },
			'completed',
		);

		return parsed;
	};
