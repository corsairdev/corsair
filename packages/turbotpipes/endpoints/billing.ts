import { logEventFromContext } from 'corsair/core';
import { makeTurbotPipesRequest, pathSegment, pickQuery } from '../client';
import type { TurbotPipesEndpoints } from '../index';
import { eventIdentifiers } from './events';
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
			eventIdentifiers(input),
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
			eventIdentifiers(input),
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
			eventIdentifiers(input),
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
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};

export const getUserBillingUpcomingInvoice: TurbotPipesEndpoints['getUserBillingUpcomingInvoice'] =
	async (ctx, input) => {
		const response = await makeTurbotPipesRequest<
			TurbotPipesEndpointOutputs['getUserBillingUpcomingInvoice']
		>(
			// The OpenAPI document lists billing/stripe/invoice/upcoming, but the
			// live API answers that path with "API Not Found" (v0 and v1, checked
			// 2026-11-05). This path is the one it serves; it returns null when
			// there is no upcoming invoice.
			`user/${pathSegment(input.user_handle)}/billing/invoice/upcoming`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'turbotpipes.billing.get_user_upcoming_invoice',
			eventIdentifiers(input),
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
			eventIdentifiers(input),
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
			eventIdentifiers(input),
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
			eventIdentifiers(input),
			'completed',
		);
		return response;
	};
