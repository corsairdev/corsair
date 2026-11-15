import type { InboxkitEndpoints } from '..';
import { call } from './call';

export const getWallet: InboxkitEndpoints['billingGetWallet'] = (ctx, input) =>
	call(ctx, 'billingGetWallet', input, () => ({
		method: 'GET',
		path: '/v1/api/billing/wallet',
	}));

export const addCredits: InboxkitEndpoints['billingAddCredits'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingAddCredits', input, (body) => ({
		method: 'POST',
		path: '/v1/api/billing/wallet',
		body,
	}));

export const getWalletLogs: InboxkitEndpoints['billingGetWalletLogs'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingGetWalletLogs', input, (query) => ({
		method: 'GET',
		path: '/v1/api/billing/wallet/logs',
		query,
	}));

export const getPaymentStatus: InboxkitEndpoints['billingGetPaymentStatus'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingGetPaymentStatus', input, (query) => ({
		method: 'GET',
		path: '/v1/api/billing/wallet/status',
		query,
	}));

export const listTransactions: InboxkitEndpoints['billingListTransactions'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingListTransactions', input, (query) => ({
		method: 'GET',
		path: '/v1/api/billing/transactions',
		query,
	}));

export const updateAutoTopup: InboxkitEndpoints['billingUpdateAutoTopup'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingUpdateAutoTopup', input, (body) => ({
		method: 'POST',
		path: '/v1/api/billing/auto-topup',
		body,
	}));

export const getPortalLink: InboxkitEndpoints['billingGetPortalLink'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingGetPortalLink', input, () => ({
		method: 'GET',
		path: '/v1/api/billing/manage',
	}));

export const getPricingPlans: InboxkitEndpoints['billingGetPricingPlans'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingGetPricingPlans', input, () => ({
		method: 'GET',
		path: '/v1/api/billing/pricing-plans',
	}));

export const getSubscription: InboxkitEndpoints['billingGetSubscription'] = (
	ctx,
	input,
) =>
	call(ctx, 'billingGetSubscription', input, () => ({
		method: 'GET',
		path: '/v1/api/billing/subscription',
	}));

export const changeSubscription: InboxkitEndpoints['billingChangeSubscription'] =
	(ctx, input) =>
		call(ctx, 'billingChangeSubscription', input, (body) => ({
			method: 'POST',
			path: '/v1/api/billing/subscription/change',
			body,
		}));

export const cancelSubscription: InboxkitEndpoints['billingCancelSubscription'] =
	(ctx, input) =>
		call(ctx, 'billingCancelSubscription', input, () => ({
			method: 'POST',
			path: '/v1/api/billing/subscription/cancel',
		}));
