import { logEventFromContext } from 'corsair/core';
import type { CompanyenrichEndpoints } from '..';
import { makeCompanyEnrichRequest } from '../client';
import type { AccountMeResponse } from './types';
import {
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
} from './types';

// Authenticated account details (docs:
// https://docs.companyenrich.com/reference/get_v2-me.md).

export const accountMe: CompanyenrichEndpoints['accountMe'] = async (
	ctx,
	input,
) => {
	CompanyenrichEndpointInputSchemas.accountMe.parse(input);

	// Free: returns the user ID, credit balance and plan capabilities.
	const response = await makeCompanyEnrichRequest<AccountMeResponse>(
		'/v2/me',
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = CompanyenrichEndpointOutputSchemas.accountMe.parse(response);

	// Credits and capabilities are account data, not personal data, but the
	// event still records only that one account lookup completed.
	await logEventFromContext(
		ctx,
		'companyenrich.account.me',
		{ count: 1 },
		'completed',
	);

	return parsed;
};
