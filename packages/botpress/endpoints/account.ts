import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '../index';
import { auditPayload } from './logging';
import { botpressCall, compactBody } from './shared';
import type { BotpressAccount, BotpressEndpointOutputs } from './types';

/** Gets the authenticated account. No workspace scoping — identity comes from the PAT. */
export const get: BotpressEndpoints['accountGet'] = async (ctx) => {
	const result = await botpressCall<{ account: BotpressAccount }>(
		ctx,
		'/v1/admin/account/me',
	);

	await logEventFromContext(ctx, 'botpress.account.get', {}, 'completed');
	return result.account;
};

/** Updates the authenticated account's display name or profile picture. */
export const update: BotpressEndpoints['accountUpdate'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<{ account: BotpressAccount }>(
		ctx,
		'/v1/admin/account/me',
		{
			method: 'PUT',
			body: compactBody({
				displayName: input.displayName,
				profilePicture: input.profilePicture,
				refresh: input.refresh,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'botpress.account.update',
		auditPayload(input, []),
		'completed',
	);
	return result.account;
};

/** Gets a single account preference by key. */
export const getPreference: BotpressEndpoints['accountGetPreference'] = async (
	ctx,
	input,
) => {
	const result = await botpressCall<
		BotpressEndpointOutputs['accountGetPreference']
	>(ctx, `/v1/admin/account/preferences/${encodeURIComponent(input.key)}`);

	await logEventFromContext(
		ctx,
		'botpress.account.getPreference',
		auditPayload(input, ['key']),
		'completed',
	);
	return result;
};

/** Sets an account preference by key. */
export const setPreference: BotpressEndpoints['accountSetPreference'] = async (
	ctx,
	input,
) => {
	await botpressCall(
		ctx,
		`/v1/admin/account/preferences/${encodeURIComponent(input.key)}`,
		{ method: 'POST', body: { value: input.value } },
	);

	await logEventFromContext(
		ctx,
		'botpress.account.setPreference',
		auditPayload(input, ['key']),
		'completed',
	);
	return {};
};
