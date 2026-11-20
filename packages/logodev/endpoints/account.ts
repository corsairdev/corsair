import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { logoDevRequest } from '../client';
import type { LogoDevContext } from '../context';
import { requireKey } from './shared';
import type { AccountResponse, GetAccountInput } from './types';
import { AccountResponseSchema, GetAccountInputSchema } from './types';

/** Plan and API credit balance. Account reads are not billed. */
export const getAccount: CorsairEndpoint<
	LogoDevContext,
	GetAccountInput,
	AccountResponse
> = async (ctx, input) => {
	const key = requireKey(ctx);
	GetAccountInputSchema.parse(input ?? {});
	// `unknown` until AccountResponseSchema parses it: untrusted provider JSON.
	const body = await logoDevRequest<unknown>(key, { path: '/v2/account' });
	const result = AccountResponseSchema.parse(body);
	await logEventFromContext(ctx, 'logodev.account.get', {}, 'completed');
	return result;
};
