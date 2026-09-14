import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	AccountGetCompanyInfoInputSchema,
	AccountGetCompanyInfoOutputSchema,
	AccountGetUserInputSchema,
	AccountGetUserOutputSchema,
	AccountUpdateAppDetailsInputSchema,
	AccountUpdateAppDetailsOutputSchema,
	AccountUpdateUserInputSchema,
	AccountUpdateUserOutputSchema,
} from './types';

/**
 * Essential FinerWorks company information — site id, postal address and
 * lobby hours.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-get_company_info
 */
export const getCompanyInfo: FinerWorksEndpoint<
	'account.getCompanyInfo'
> = async (ctx, input = {}) => {
	AccountGetCompanyInfoInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/get_company_info',
		credentials,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'finerworks.account.getCompanyInfo',
		{},
		'completed',
	);
	return AccountGetCompanyInfoOutputSchema.parse(res);
};

/**
 * The authenticated account profile, including billing and business addresses.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-get_user_account_key
 */
export const getUser: FinerWorksEndpoint<'account.getUser'> = async (
	ctx,
	input = {},
) => {
	const validated = AccountGetUserInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>('v3/get_user', credentials, {
		method: 'GET',
		query: validated.account_key
			? { account_key: validated.account_key }
			: undefined,
	});

	await logEventFromContext(ctx, 'finerworks.account.getUser', {}, 'completed');
	return AccountGetUserOutputSchema.parse(res);
};

/**
 * Update the account profile — addresses, logo, payment profile and
 * shipping preferences.
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-update_user
 */
export const updateUser: FinerWorksEndpoint<'account.updateUser'> = async (
	ctx,
	input,
) => {
	const validated = AccountUpdateUserInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/update_user',
		credentials,
		{
			method: 'PUT',
			body: validated,
		},
	);

	await logEventFromContext(
		ctx,
		'finerworks.account.updateUser',
		{},
		'completed',
	);
	return AccountUpdateUserOutputSchema.parse(res);
};

/**
 * Update the calling application's name, description and live mode.
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-update_app_details
 */
export const updateAppDetails: FinerWorksEndpoint<
	'account.updateAppDetails'
> = async (ctx, input) => {
	const validated = AccountUpdateAppDetailsInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/update_app_details',
		credentials,
		{ method: 'PUT', body: validated },
	);

	// `app_name` is safe to log; the app key itself never is.
	await logEventFromContext(
		ctx,
		'finerworks.account.updateAppDetails',
		{ app_name: validated.app_details.app_name ?? null },
		'completed',
	);
	return AccountUpdateAppDetailsOutputSchema.parse(res);
};

export const AccountEndpoints = {
	getCompanyInfo,
	getUser,
	updateUser,
	updateAppDetails,
} as const;
