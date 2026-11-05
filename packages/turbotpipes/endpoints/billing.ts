import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import type { TurbotPipesEndpointOutputs } from './types';

export const deleteOrgBillingSubscription: TurbotPipesEndpoints['deleteOrgBillingSubscription'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['deleteOrgBillingSubscription']
		>(
			`org/${pathSegment(input.org_handle)}/billing/subscription/${pathSegment(input.subscription_id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.delete_org_subscription',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateOrgBillingSubscription: TurbotPipesEndpoints['updateOrgBillingSubscription'] =
	async (ctx, input) => {
		const { org_handle, subscription_id, action } = input;
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['updateOrgBillingSubscription']
		>(
			`org/${pathSegment(org_handle)}/billing/subscription/${pathSegment(subscription_id)}`,
			ctx.key,
			{
				method: 'PATCH',
				body: { action },
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.update_org_subscription',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getOrgBillingInvoice: TurbotPipesEndpoints['getOrgBillingInvoice'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getOrgBillingInvoice']
		>(
			`org/${pathSegment(input.org_handle)}/billing/invoice/${pathSegment(input.invoice_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.get_org_invoice',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserBillingPlan: TurbotPipesEndpoints['getUserBillingPlan'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserBillingPlan']
		>(`user/${pathSegment(input.user_handle)}/billing/plan`, ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.get_user_plan',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserBillingUpcomingInvoice: TurbotPipesEndpoints['getUserBillingUpcomingInvoice'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserBillingUpcomingInvoice']
		>(
			`user/${pathSegment(input.user_handle)}/billing/invoice/upcoming`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.get_user_upcoming_invoice',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserBillingInvoices: TurbotPipesEndpoints['listUserBillingInvoices'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserBillingInvoices']
		>(`user/${pathSegment(input.user_handle)}/billing/invoice`, ctx.key, {
			method: 'GET',
			query: pickQuery(input, ['limit', 'next_token']),
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.list_user_invoices',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserBillingPaymentMethods: TurbotPipesEndpoints['listUserBillingPaymentMethods'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserBillingPaymentMethods']
		>(
			`user/${pathSegment(input.user_handle)}/billing/payment_method`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.list_user_payment_methods',
			{ ...input },
			'completed',
		);
		return response;
	};

export const listUserBillingSubscriptions: TurbotPipesEndpoints['listUserBillingSubscriptions'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['listUserBillingSubscriptions']
		>(`user/${pathSegment(input.user_handle)}/billing/subscription`, ctx.key, {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.list_user_subscriptions',
			{ ...input },
			'completed',
		);
		return response;
	};
