import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext, ClickSendEndpoints } from '../index';
import { ClickSendEndpointOutputSchemas } from './types';

export const get: ClickSendEndpoints['accountGet'] = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('account', username, apiKey, {
		method: 'GET',
		responseSchema: ClickSendEndpointOutputSchemas.accountGet,
	});

	await logEventFromContext(
		ctx,
		'clicksend.account.get',
		{ ...input },
		'completed',
	);

	return response;
};

// ── account.update ────────────────────────────────────────────────────────────

export const AccountUpdateInputSchema = z
	.object({
		user_email: z.string().optional(),
		user_first_name: z.string().optional(),
		user_last_name: z.string().optional(),
		user_phone: z.string().optional(),
		account_name: z.string().optional(),
		country: z.string().optional(),
		timezone: z.string().optional(),
	})
	.strict();
export type AccountUpdateInput = z.infer<typeof AccountUpdateInputSchema>;

export const AccountUpdateResponseSchema = z
	.object({
		user_id: z.union([z.number(), z.string()]).optional(),
		username: z.string().optional(),
		user_email: z.string().optional(),
		user_first_name: z.string().optional(),
		user_last_name: z.string().optional(),
		balance: z.number().optional(),
		currency: z.string().optional(),
	})
	.passthrough();
export type AccountUpdateResponse = z.infer<typeof AccountUpdateResponseSchema>;

export const update: CorsairEndpoint<
	ClickSendContext,
	AccountUpdateInput,
	AccountUpdateResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('account', username, apiKey, {
		method: 'PUT',
		body: {
			user_email: input.user_email,
			user_first_name: input.user_first_name,
			user_last_name: input.user_last_name,
			user_phone: input.user_phone,
			account_name: input.account_name,
			country: input.country,
			timezone: input.timezone,
		},
		responseSchema: AccountUpdateResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.account.update',
		{ ...input },
		'completed',
	);

	return response;
};
