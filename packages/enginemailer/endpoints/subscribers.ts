import type { EnginemailerSubscriberEndpoints } from '..';
import { makeEnginemailerRequest } from '../client';
import type { EnginemailerEndpointOutputs } from './types';

const get = <T>(
	ctx: { key: string },
	path: string,
	// Provider query fields differ between legacy subscriber endpoints; schemas
	// validate each operation before this shared serializer is called.
	query?: Record<string, unknown>,
) =>
	makeEnginemailerRequest<T>(path, ctx.key, {
		method: 'GET',
		query: query as Record<
			string,
			string | number | boolean | string[] | undefined
		>,
	});

const post = <T>(
	ctx: { key: string },
	path: string,
	// Custom fields are provider-defined JSON and cannot share a narrower type.
	body: Record<string, unknown>,
) => makeEnginemailerRequest<T>(path, ctx.key, { method: 'POST', body });

export const subscriberEndpoints: EnginemailerSubscriberEndpoints = {
	get: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['getSubscriber']>(
			ctx,
			'/restapi/subscriber/emsubscriber/getSubscriber',
			{
				email: input.email,
			},
		),
	activate: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['activateSubscriber']>(
			ctx,
			'/restapi/subscriber/emsubscriber/activateSubscriber',
			{ email: input.email },
		),
	insert: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['insertSubscriber']>(
			ctx,
			'/restapi/subscriber/emsubscriber/insertSubscriber',
			input,
		),
	update: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['updateSubscriber']>(
			ctx,
			'/restapi/subscriber/emsubscriber/updateSubscriber',
			input,
		),
	unsubscribe: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['unsubscribeSubscriber']>(
			ctx,
			'/restapi/subscriber/emsubscriber/unSubSubscriber',
			{ email: input.email },
		),
	getSubcategories: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['getSubcategories']>(
			ctx,
			'/restapi/subscriber/emsubscriber/getSubCategory',
			input,
		),
	updateCategory: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['updateCategory']>(
			ctx,
			'/restapi/subscriber/emsubscriber/updateCategory',
			input,
		),
	getCustomFields: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['getCustomFields']>(
			ctx,
			'/restapi/subscriber/emsubscriber/getCustomField',
			input,
		),
	batchUpdateSubscribers: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['batchUpdateSubscribers']>(
			ctx,
			'/restapi/subscriber/emsubscriber/batchUpdateSubscribers',
			input,
		),
	batchUpdateStatus: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['batchUpdateStatus']>(
			ctx,
			'/restapi/subscriber/emsubscriber/batchUpdateStatus',
			input,
		),
	deleteSubscriber: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['deleteSubscriber']>(
			ctx,
			'/restapi/subscriber/emsubscriber/deleteSubscriber',
			input,
		),
};
