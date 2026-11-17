import type { TapfiliateEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	CustomersCancelInputSchema,
	CustomersCancelResponseSchema,
	CustomersCreateInputSchema,
	CustomersCreateResponseSchema,
	CustomersGetInputSchema,
	CustomersGetResponseSchema,
	CustomersListInputSchema,
	CustomersListResponseSchema,
	CustomersRemoveInputSchema,
	CustomersUncancelInputSchema,
	CustomersUncancelResponseSchema,
	CustomersUpdateInputSchema,
	CustomersUpdateResponseSchema,
} from './types';

export const list: TapfiliateEndpoints['customersList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.list',
			input: CustomersListInputSchema,
			output: CustomersListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/customers/',
			query: {
				page: parsed.page,
				program_id: parsed.program_id,
				customer_id: parsed.customer_id,
				affiliate_id: parsed.affiliate_id,
				date_from: parsed.date_from,
				date_to: parsed.date_to,
			},
		}),
	);
};

export const get: TapfiliateEndpoints['customersGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'customers.get',
			input: CustomersGetInputSchema,
			output: CustomersGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/customers/${segment(parsed.customerId)}/`,
		}),
	);
};

export const create: TapfiliateEndpoints['customersCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.create',
			input: CustomersCreateInputSchema,
			output: CustomersCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/customers/',
			body: {
				customer_id: parsed.customer_id,
				status: parsed.status,
				referral_code: parsed.referral_code,
				tracking_id: parsed.tracking_id,
				click_id: parsed.click_id,
				coupon: parsed.coupon,
				asset_id: parsed.asset_id,
				source_id: parsed.source_id,
			},
		}),
	);
};

export const update: TapfiliateEndpoints['customersUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.update',
			input: CustomersUpdateInputSchema,
			output: CustomersUpdateResponseSchema,
		},
		input,
		(parsed) => {
			const { customerId, ...changes } = parsed;
			return {
				method: 'PATCH',
				path: `/customers/${segment(customerId)}/`,
				body: changes,
			};
		},
	);
};

export const remove: TapfiliateEndpoints['customersRemove'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{ event: 'customers.remove', input: CustomersRemoveInputSchema },
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/customers/${segment(parsed.customerId)}/`,
		}),
	);
};

export const cancel: TapfiliateEndpoints['customersCancel'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.cancel',
			input: CustomersCancelInputSchema,
			output: CustomersCancelResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/customers/${segment(parsed.customerId)}/status/`,
		}),
	);
};

export const uncancel: TapfiliateEndpoints['customersUncancel'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'customers.uncancel',
			input: CustomersUncancelInputSchema,
			output: CustomersUncancelResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/customers/${segment(parsed.customerId)}/status/`,
		}),
	);
};
