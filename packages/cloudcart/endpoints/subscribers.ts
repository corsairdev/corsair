import type { CloudcartEndpoints } from '../index';
import { pathId, runCloudcart } from './run';
import {
	CloudcartEndpointOutputSchemas,
	CreateSubscriberChannelInputSchema,
	CreateSubscriberInputSchema,
	CreateSubscriberTagInputSchema,
	DeleteSubscriberInputSchema,
	DeleteSubscribersChannelInputSchema,
	DeleteSubscriberTagInputSchema,
	GetSubscriberInputSchema,
	GetSubscribersChannelInputSchema,
	GetSubscriberTagInputSchema,
	ListSubscribersChannelsInputSchema,
	ListSubscribersInputSchema,
	ListSubscribersTagsInputSchema,
	UpdateSubscriberInputSchema,
	UpdateSubscribersChannelInputSchema,
	UpdateSubscriberTagInputSchema,
} from './types';

export const createSubscriber: CloudcartEndpoints['createSubscriber'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.createSubscriber',
		inputSchema: CreateSubscriberInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createSubscriber,
		method: 'POST',
		path: 'subscribers',
	});

export const getSubscriber: CloudcartEndpoints['getSubscriber'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.getSubscriber',
		inputSchema: GetSubscriberInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getSubscriber,
		path: (parsed) => `subscribers/${pathId(parsed.id)}`,
	});

export const listSubscribers: CloudcartEndpoints['listSubscribers'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.listSubscribers',
		inputSchema: ListSubscribersInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listSubscribers,
		path: 'subscribers',
	});

export const updateSubscriber: CloudcartEndpoints['updateSubscriber'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.updateSubscriber',
		inputSchema: UpdateSubscriberInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateSubscriber,
		method: 'PATCH',
		path: (parsed) => `subscribers/${pathId(parsed.id)}`,
	});

export const deleteSubscriber: CloudcartEndpoints['deleteSubscriber'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.deleteSubscriber',
		inputSchema: DeleteSubscriberInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteSubscriber,
		method: 'DELETE',
		path: (parsed) => `subscribers/${pathId(parsed.id)}`,
	});

export const createSubscriberChannel: CloudcartEndpoints['createSubscriberChannel'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.subscribers.createSubscriberChannel',
			inputSchema: CreateSubscriberChannelInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.createSubscriberChannel,
			method: 'POST',
			path: 'subscriber-channels',
		});

export const getSubscribersChannel: CloudcartEndpoints['getSubscribersChannel'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.subscribers.getSubscribersChannel',
			inputSchema: GetSubscribersChannelInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.getSubscribersChannel,
			path: (parsed) => `subscriber-channels/${pathId(parsed.id)}`,
		});

export const listSubscribersChannels: CloudcartEndpoints['listSubscribersChannels'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.subscribers.listSubscribersChannels',
			inputSchema: ListSubscribersChannelsInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.listSubscribersChannels,
			path: 'subscriber-channels',
		});

export const updateSubscribersChannel: CloudcartEndpoints['updateSubscribersChannel'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.subscribers.updateSubscribersChannel',
			inputSchema: UpdateSubscribersChannelInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.updateSubscribersChannel,
			method: 'PATCH',
			path: (parsed) => `subscriber-channels/${pathId(parsed.id)}`,
		});

export const deleteSubscribersChannel: CloudcartEndpoints['deleteSubscribersChannel'] =
	(ctx, input) =>
		runCloudcart(ctx, input, {
			event: 'cloudcart.subscribers.deleteSubscribersChannel',
			inputSchema: DeleteSubscribersChannelInputSchema,
			outputSchema: CloudcartEndpointOutputSchemas.deleteSubscribersChannel,
			method: 'DELETE',
			path: (parsed) => `subscriber-channels/${pathId(parsed.id)}`,
		});

export const createSubscriberTag: CloudcartEndpoints['createSubscriberTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.createSubscriberTag',
		inputSchema: CreateSubscriberTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.createSubscriberTag,
		method: 'POST',
		path: 'subscriber-tags',
	});

export const getSubscriberTag: CloudcartEndpoints['getSubscriberTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.getSubscriberTag',
		inputSchema: GetSubscriberTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.getSubscriberTag,
		path: (parsed) => `subscriber-tags/${pathId(parsed.id)}`,
	});

export const listSubscribersTags: CloudcartEndpoints['listSubscribersTags'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.listSubscribersTags',
		inputSchema: ListSubscribersTagsInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.listSubscribersTags,
		path: 'subscriber-tags',
	});

export const updateSubscriberTag: CloudcartEndpoints['updateSubscriberTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.updateSubscriberTag',
		inputSchema: UpdateSubscriberTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.updateSubscriberTag,
		method: 'PATCH',
		path: (parsed) => `subscriber-tags/${pathId(parsed.id)}`,
	});

export const deleteSubscriberTag: CloudcartEndpoints['deleteSubscriberTag'] = (
	ctx,
	input,
) =>
	runCloudcart(ctx, input, {
		event: 'cloudcart.subscribers.deleteSubscriberTag',
		inputSchema: DeleteSubscriberTagInputSchema,
		outputSchema: CloudcartEndpointOutputSchemas.deleteSubscriberTag,
		method: 'DELETE',
		path: (parsed) => `subscriber-tags/${pathId(parsed.id)}`,
	});
