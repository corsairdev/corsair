import { logEventFromContext } from 'corsair/core';
import { makeAblyListRequest, makeAblyRequest } from '../client';
import type { AblyEndpoints } from '../index';
import type { AblyEndpointOutputs } from './types';

const enc = encodeURIComponent;

export const publishPushNotificationsBatch: AblyEndpoints['publishPushNotificationsBatch'] =
	async (ctx, input) => {
		const result = await makeAblyRequest<
			AblyEndpointOutputs['publishPushNotificationsBatch']
		>('push/batch/publish', ctx.key, {
			method: 'POST',
			body: input.notifications,
		});

		await logEventFromContext(ctx, 'ably.push.publishBatch', {}, 'completed');

		return result;
	};

export const deleteChannelSubscription: AblyEndpoints['deleteChannelSubscription'] =
	async (ctx, input) => {
		const result = await makeAblyRequest<
			AblyEndpointOutputs['deleteChannelSubscription']
		>('push/channelSubscriptions', ctx.key, {
			method: 'DELETE',
			query: input,
		});

		await logEventFromContext(
			ctx,
			'ably.push.deleteChannelSubscription',
			{ channel: input.channel },
			'completed',
		);

		return result;
	};

export const createPushChannelSubscription: AblyEndpoints['createPushChannelSubscription'] =
	async (ctx, input) => {
		const result = await makeAblyRequest<
			AblyEndpointOutputs['createPushChannelSubscription']
		>('push/channelSubscriptions', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'ably.push.createChannelSubscription',
			{ channel: input.channel },
			'completed',
		);

		return result;
	};

export const getPushDevice: AblyEndpoints['getPushDevice'] = async (
	ctx,
	input,
) => {
	const result = await makeAblyRequest<AblyEndpointOutputs['getPushDevice']>(
		`push/deviceRegistrations/${enc(input.deviceId)}`,
		ctx.key,
	);

	await logEventFromContext(ctx, 'ably.push.getDevice', {}, 'completed');

	return result;
};

export const listPushChannelSubscriptions: AblyEndpoints['listPushChannelSubscriptions'] =
	async (ctx, input) => {
		const { next, ...query } = input;
		const result = await makeAblyListRequest<
			AblyEndpointOutputs['listPushChannelSubscriptions']['items'][number]
		>('push/channelSubscriptions', ctx.key, {
			query: {
				...query,
				...next,
			},
		});

		await logEventFromContext(
			ctx,
			'ably.push.listChannelSubscriptions',
			{
				channel: input.channel,
				limit: input.limit,
			},
			'completed',
		);

		return result;
	};

export const listPushChannels: AblyEndpoints['listPushChannels'] = async (
	ctx,
	input,
) => {
	const { next, ...query } = input;
	const result = await makeAblyListRequest<
		AblyEndpointOutputs['listPushChannels']['items'][number]
	>('push/channels', ctx.key, {
		query: {
			...query,
			...next,
		},
	});

	await logEventFromContext(
		ctx,
		'ably.push.listChannels',
		{
			prefix: input.prefix,
			limit: input.limit,
		},
		'completed',
	);

	return result;
};

export const listRegisteredPushDevices: AblyEndpoints['listRegisteredPushDevices'] =
	async (ctx, input) => {
		const { next, ...query } = input;
		const result = await makeAblyListRequest<
			AblyEndpointOutputs['listRegisteredPushDevices']['items'][number]
		>('push/deviceRegistrations', ctx.key, {
			query: {
				...query,
				...next,
			},
		});

		await logEventFromContext(
			ctx,
			'ably.push.listDevices',
			{
				limit: input.limit,
			},
			'completed',
		);

		return result;
	};

export const patchPushDeviceRegistration: AblyEndpoints['patchPushDeviceRegistration'] =
	async (ctx, input) => {
		const { deviceId, ...body } = input;

		const result = await makeAblyRequest<
			AblyEndpointOutputs['patchPushDeviceRegistration']
		>(`push/deviceRegistrations/${enc(deviceId)}`, ctx.key, {
			method: 'PATCH',
			body,
		});

		await logEventFromContext(ctx, 'ably.push.patchDevice', {}, 'completed');

		return result;
	};

export const publishPushNotification: AblyEndpoints['publishPushNotification'] =
	async (ctx, input) => {
		const result = await makeAblyRequest<
			AblyEndpointOutputs['publishPushNotification']
		>('push/publish', ctx.key, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(ctx, 'ably.push.publish', {}, 'completed');

		return result;
	};

export const registerPushDevice: AblyEndpoints['registerPushDevice'] = async (
	ctx,
	input,
) => {
	const result = await makeAblyRequest<
		AblyEndpointOutputs['registerPushDevice']
	>('push/deviceRegistrations', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(ctx, 'ably.push.registerDevice', {}, 'completed');

	return result;
};

export const unregisterAllPushDevices: AblyEndpoints['unregisterAllPushDevices'] =
	async (ctx, input) => {
		const result = await makeAblyRequest<
			AblyEndpointOutputs['unregisterAllPushDevices']
		>('push/deviceRegistrations', ctx.key, {
			method: 'DELETE',
			query: input,
		});

		await logEventFromContext(
			ctx,
			'ably.push.unregisterDevices',
			{},
			'completed',
		);

		return result;
	};

export const unregisterPushDevice: AblyEndpoints['unregisterPushDevice'] =
	async (ctx, input) => {
		const result = await makeAblyRequest<
			AblyEndpointOutputs['unregisterPushDevice']
		>(`push/deviceRegistrations/${enc(input.deviceId)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'ably.push.unregisterDevice',
			{},
			'completed',
		);

		return result;
	};

export const updatePushDevice: AblyEndpoints['updatePushDevice'] = async (
	ctx,
	input,
) => {
	const { id, ...rest } = input;

	const result = await makeAblyRequest<AblyEndpointOutputs['updatePushDevice']>(
		`push/deviceRegistrations/${enc(id)}`,
		ctx.key,
		{
			method: 'PUT',
			body: {
				id,
				...rest,
			},
		},
	);

	await logEventFromContext(ctx, 'ably.push.updateDevice', {}, 'completed');

	return result;
};
