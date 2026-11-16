import type { TapfiliateEndpoints } from '..';
import { segment } from '../client';
import { call, callDelete } from './call';
import {
	BalancesListInputSchema,
	BalancesListResponseSchema,
	ClicksCreateInputSchema,
	ClicksCreateResponseSchema,
	ClicksGetInputSchema,
	ClicksGetResponseSchema,
	ClicksListInputSchema,
	ClicksListResponseSchema,
	PaymentsCancelInputSchema,
	PaymentsCreateInputSchema,
	PaymentsCreateResponseSchema,
	PaymentsGetInputSchema,
	PaymentsGetResponseSchema,
	PaymentsListInputSchema,
	PaymentsListResponseSchema,
} from './types';

export const paymentsList: TapfiliateEndpoints['paymentsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'payments.list',
			input: PaymentsListInputSchema,
			output: PaymentsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/payments/',
			query: { page: parsed.page },
		}),
	);
};

export const paymentsGet: TapfiliateEndpoints['paymentsGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'payments.get',
			input: PaymentsGetInputSchema,
			output: PaymentsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/payments/${segment(parsed.paymentId)}/`,
		}),
	);
};

export const paymentsCreate: TapfiliateEndpoints['paymentsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'payments.create',
			input: PaymentsCreateInputSchema,
			output: PaymentsCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/payments/',
			// The route takes one payment or an array, and always answers an array.
			body: parsed,
		}),
	);
};

export const paymentsCancel: TapfiliateEndpoints['paymentsCancel'] = async (
	ctx,
	input,
) => {
	return callDelete(
		ctx,
		{ event: 'payments.cancel', input: PaymentsCancelInputSchema },
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/payments/${segment(parsed.paymentId)}/`,
		}),
	);
};

export const balancesList: TapfiliateEndpoints['balancesList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'balances.list',
			input: BalancesListInputSchema,
			output: BalancesListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/balances/',
			query: { page: parsed.page, include_fraud: parsed.include_fraud },
		}),
	);
};

export const clicksList: TapfiliateEndpoints['clicksList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'clicks.list',
			input: ClicksListInputSchema,
			output: ClicksListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/clicks/',
			query: {
				page: parsed.page,
				program_id: parsed.program_id,
				affiliate_id: parsed.affiliate_id,
				date_from: parsed.date_from,
				date_to: parsed.date_to,
				'meta_data[key]': parsed.meta_data?.key,
				'meta_data[value]': parsed.meta_data?.value,
			},
		}),
	);
};

export const clicksCreate: TapfiliateEndpoints['clicksCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'clicks.create',
			input: ClicksCreateInputSchema,
			output: ClicksCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/clicks/',
			body: {
				referral_code: parsed.referral_code,
				tracking_id: parsed.tracking_id,
				click_id: parsed.click_id,
				coupon: parsed.coupon,
				asset_id: parsed.asset_id,
				source_id: parsed.source_id,
				ip: parsed.ip,
				user_agent: parsed.user_agent,
				referrer: parsed.referrer,
				landing_page: parsed.landing_page,
			},
		}),
	);
};

export const clicksGet: TapfiliateEndpoints['clicksGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'clicks.get',
			input: ClicksGetInputSchema,
			output: ClicksGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/clicks/${segment(parsed.clickId)}/`,
		}),
	);
};
