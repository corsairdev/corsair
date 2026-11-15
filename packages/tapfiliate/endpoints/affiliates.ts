import type { TapfiliateEndpoints } from '..';
import { call, callDelete } from './call';
import {
	AffiliatesBalancesInputSchema,
	AffiliatesBalancesResponseSchema,
	AffiliatesCreateInputSchema,
	AffiliatesCreateResponseSchema,
	AffiliatesCustomFieldsInputSchema,
	AffiliatesCustomFieldsResponseSchema,
	AffiliatesGetInputSchema,
	AffiliatesGetResponseSchema,
	AffiliatesListInputSchema,
	AffiliatesListResponseSchema,
	AffiliatesPaymentsInputSchema,
	AffiliatesPaymentsResponseSchema,
	AffiliatesProgramsInputSchema,
	AffiliatesProgramsResponseSchema,
	AffiliatesRemoveInputSchema,
} from './types';

export const list: TapfiliateEndpoints['affiliatesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'affiliates.list',
			input: AffiliatesListInputSchema,
			output: AffiliatesListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/affiliates/',
			query: {
				page: parsed.page,
				click_id: parsed.click_id,
				source_id: parsed.source_id,
				email: parsed.email,
				referral_code: parsed.referral_code,
				parent_id: parsed.parent_id,
				affiliate_group_id: parsed.affiliate_group_id,
			},
		}),
	);
};

export const get: TapfiliateEndpoints['affiliatesGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'affiliates.get',
			input: AffiliatesGetInputSchema,
			output: AffiliatesGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/affiliates/${parsed.affiliateId}/`,
		}),
	);
};

export const create: TapfiliateEndpoints['affiliatesCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'affiliates.create',
			input: AffiliatesCreateInputSchema,
			output: AffiliatesCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/affiliates/',
			body: {
				email: parsed.email,
				password: parsed.password,
				firstname: parsed.firstname,
				lastname: parsed.lastname,
				company: parsed.company,
				address: parsed.address,
				custom_fields: parsed.custom_fields,
			},
		}),
	);
};

export const remove: TapfiliateEndpoints['affiliatesRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{ event: 'affiliates.remove', input: AffiliatesRemoveInputSchema },
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/affiliates/${parsed.affiliateId}/`,
		}),
	);
};

export const balances: TapfiliateEndpoints['affiliatesBalances'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'affiliates.balances',
			input: AffiliatesBalancesInputSchema,
			output: AffiliatesBalancesResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/affiliates/${parsed.affiliateId}/balances/`,
		}),
	);
};

export const payments: TapfiliateEndpoints['affiliatesPayments'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'affiliates.payments',
			input: AffiliatesPaymentsInputSchema,
			output: AffiliatesPaymentsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/affiliates/${parsed.affiliateId}/payments/`,
		}),
	);
};

export const programs: TapfiliateEndpoints['affiliatesPrograms'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'affiliates.programs',
			input: AffiliatesProgramsInputSchema,
			output: AffiliatesProgramsResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/affiliates/${parsed.affiliateId}/programs/`,
		}),
	);
};

export const customFields: TapfiliateEndpoints['affiliatesCustomFields'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'affiliates.customFields',
				input: AffiliatesCustomFieldsInputSchema,
				output: AffiliatesCustomFieldsResponseSchema,
			},
			input,
			() => ({ method: 'GET', path: '/affiliates/custom-fields/' }),
		);
	};
