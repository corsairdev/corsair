import type { PaystackEndpoints } from '..';
import { call } from './call';
import {
	PaystackEndpointInputSchemas as Inputs,
	PaystackEndpointOutputSchemas as Outputs,
} from './types';

export const create: PaystackEndpoints['subscriptionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.create',
			input: Inputs.subscriptionsCreate,
			output: Outputs.subscriptionsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/subscription', body }),
		{
			log: (_, result) => ({
				subscriptionCode: result.data.subscription_code ?? undefined,
			}),
		},
	);

export const list: PaystackEndpoints['subscriptionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.list',
			input: Inputs.subscriptionsList,
			output: Outputs.subscriptionsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/subscription', query }),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PaystackEndpoints['subscriptionsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.get',
			input: Inputs.subscriptionsGet,
			output: Outputs.subscriptionsGet,
		},
		input,
		({ idOrCode }) => ({
			method: 'GET',
			path: `/subscription/${encodeURIComponent(idOrCode)}`,
		}),
		{
			log: (_, result) => ({
				subscriptionCode: result.data.subscription_code ?? undefined,
				status: result.data.status ?? undefined,
			}),
		},
	);

export const enable: PaystackEndpoints['subscriptionsEnable'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'subscriptions.enable',
			input: Inputs.subscriptionsEnable,
			output: Outputs.subscriptionsEnable,
		},
		input,
		(body) => ({ method: 'POST', path: '/subscription/enable', body }),
		{ log: (_, result) => ({ success: result.status }) },
	);

export const disable: PaystackEndpoints['subscriptionsDisable'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'subscriptions.disable',
			input: Inputs.subscriptionsDisable,
			output: Outputs.subscriptionsDisable,
		},
		input,
		(body) => ({ method: 'POST', path: '/subscription/disable', body }),
		{ log: (_, result) => ({ success: result.status }) },
	);
