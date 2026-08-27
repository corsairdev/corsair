import { logEventFromContext } from 'corsair/core';
import { makeCloudcartRequest } from '../client';
import type { CloudcartEndpoints } from '../index';
import type { CloudcartEndpointOutputs } from './types';

export const createSubscriber: CloudcartEndpoints['createSubscriber'] = async (
	ctx,
	input,
) => {
	const { data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['createSubscriber']
	>('subscribers', ctx.key, {
		method: 'POST',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.subscribers.createSubscriber',
		{ ...input },
		'completed',
	);
	return result;
};

export const getSubscriber: CloudcartEndpoints['getSubscriber'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['getSubscriber']
	>(`subscribers/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.subscribers.getSubscriber',
		{ ...input },
		'completed',
	);
	return result;
};

export const listSubscribers: CloudcartEndpoints['listSubscribers'] = async (
	ctx,
	input,
) => {
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['listSubscribers']
	>('subscribers', ctx.key, {
		method: 'GET',
		query: input as Record<string, any>,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.subscribers.listSubscribers',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateSubscriber: CloudcartEndpoints['updateSubscriber'] = async (
	ctx,
	input,
) => {
	const { id, data, ...rest } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['updateSubscriber']
	>(`subscribers/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'PATCH',
		body: data || rest,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.subscribers.updateSubscriber',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSubscriber: CloudcartEndpoints['deleteSubscriber'] = async (
	ctx,
	input,
) => {
	const { id } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['deleteSubscriber']
	>(`subscribers/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'cloudcart.subscribers.deleteSubscriber',
		{ ...input },
		'completed',
	);
	return result;
};

export const createSubscriberChannel: CloudcartEndpoints['createSubscriberChannel'] =
	async (ctx, input) => {
		const { data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['createSubscriberChannel']
		>('subscriber-channels', ctx.key, {
			method: 'POST',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.createSubscriberChannel',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getSubscribersChannel: CloudcartEndpoints['getSubscribersChannel'] =
	async (ctx, input) => {
		const { id, ...query } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['getSubscribersChannel']
		>(`subscriber-channels/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'GET',
			query,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.getSubscribersChannel',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listSubscribersChannels: CloudcartEndpoints['listSubscribersChannels'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listSubscribersChannels']
		>('subscriber-channels', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.listSubscribersChannels',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateSubscribersChannel: CloudcartEndpoints['updateSubscribersChannel'] =
	async (ctx, input) => {
		const { id, data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['updateSubscribersChannel']
		>(`subscriber-channels/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'PATCH',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.updateSubscribersChannel',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteSubscribersChannel: CloudcartEndpoints['deleteSubscribersChannel'] =
	async (ctx, input) => {
		const { id } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['deleteSubscribersChannel']
		>(`subscriber-channels/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.deleteSubscribersChannel',
			{ ...input },
			'completed',
		);
		return result;
	};

export const createSubscriberTag: CloudcartEndpoints['createSubscriberTag'] =
	async (ctx, input) => {
		const { data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['createSubscriberTag']
		>('subscriber-tags', ctx.key, {
			method: 'POST',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.createSubscriberTag',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getSubscriberTag: CloudcartEndpoints['getSubscriberTag'] = async (
	ctx,
	input,
) => {
	const { id, ...query } = (input as Record<string, any>) || {};
	const result = await makeCloudcartRequest<
		CloudcartEndpointOutputs['getSubscriberTag']
	>(`subscriber-tags/${encodeURIComponent(String(id))}`, ctx.key, {
		method: 'GET',
		query,
	});
	await logEventFromContext(
		ctx,
		'cloudcart.subscribers.getSubscriberTag',
		{ ...input },
		'completed',
	);
	return result;
};

export const listSubscribersTags: CloudcartEndpoints['listSubscribersTags'] =
	async (ctx, input) => {
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['listSubscribersTags']
		>('subscriber-tags', ctx.key, {
			method: 'GET',
			query: input as Record<string, any>,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.listSubscribersTags',
			{ ...input },
			'completed',
		);
		return result;
	};

export const updateSubscriberTag: CloudcartEndpoints['updateSubscriberTag'] =
	async (ctx, input) => {
		const { id, data, ...rest } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['updateSubscriberTag']
		>(`subscriber-tags/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'PATCH',
			body: data || rest,
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.updateSubscriberTag',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteSubscriberTag: CloudcartEndpoints['deleteSubscriberTag'] =
	async (ctx, input) => {
		const { id } = (input as Record<string, any>) || {};
		const result = await makeCloudcartRequest<
			CloudcartEndpointOutputs['deleteSubscriberTag']
		>(`subscriber-tags/${encodeURIComponent(String(id))}`, ctx.key, {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'cloudcart.subscribers.deleteSubscriberTag',
			{ ...input },
			'completed',
		);
		return result;
	};
