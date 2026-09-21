import { logEventFromContext } from 'corsair/core';
import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type {
	CodacyContext,
	CodacyEndpointInputs,
	CodacyEndpointOutputs,
	CodacyEndpoints,
} from '../index';
import { AccountGetOutputSchema } from './types';

/**
 * Get the authenticated user's account details.
 *
 * API: GET /user
 * Docs: https://api.codacy.com/api/api-docs
 */
export const get: CodacyEndpoints['accountGet'] = async (
	ctx: CodacyContext,
	input: CodacyEndpointInputs['accountGet'],
): Promise<CodacyEndpointOutputs['accountGet']> => {
	const token = await getCodacyCredentials(ctx);

	const response = await makeCodacyRequest<CodacyEndpointOutputs['accountGet']>(
		'/user',
		token,
	);

	const parsed = AccountGetOutputSchema.parse(response);

	if (ctx.db.accounts) {
		try {
			await ctx.db.accounts.upsertByEntityId(String(parsed.data.id), {
				...parsed.data,
			});
		} catch (error) {
			console.warn('Failed to save account to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'codacy.account.get',
		{ ...input },
		'completed',
	);
	return parsed;
};
