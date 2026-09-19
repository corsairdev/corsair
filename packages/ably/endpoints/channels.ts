import { logEventFromContext } from 'corsair/core';
import { makeAblyListRequest, makeAblyRequest } from '../client';
import type { AblyEndpoints } from '../index';
import type { AblyEndpointOutputs } from './types';

const enc = encodeURIComponent;
const BATCH_PRESENCE_HISTORY_CONCURRENCY = 5;

export const publishBatchMessages: AblyEndpoints['publishBatchMessages'] =
	async (ctx, input) => {
		const result = await makeAblyRequest<
			AblyEndpointOutputs['publishBatchMessages']
		>('messages', ctx.key, {
			method: 'POST',
			body: input.messages,
		});

		await logEventFromContext(
			ctx,
			'ably.channels.publishBatchMessages',
			{},
			'completed',
		);

		return result;
	};

export const getChannelDetails: AblyEndpoints['getChannelDetails'] = async (
	ctx,
	input,
) => {
	const result = await makeAblyRequest<
		AblyEndpointOutputs['getChannelDetails']
	>(`channels/${enc(input.channelId)}`, ctx.key);

	await logEventFromContext(
		ctx,
		'ably.channels.getDetails',
		{ channelId: input.channelId },
		'completed',
	);

	return result;
};

export const getChannelHistory: AblyEndpoints['getChannelHistory'] = async (
	ctx,
	input,
) => {
	const { channelId, ...query } = input;

	const result = await makeAblyRequest<
		AblyEndpointOutputs['getChannelHistory']
	>(`channels/${enc(channelId)}/messages`, ctx.key, {
		query,
	});

	await logEventFromContext(
		ctx,
		'ably.channels.getHistory',
		{ channelId },
		'completed',
	);

	return result;
};

export const getChannelPresence: AblyEndpoints['getChannelPresence'] = async (
	ctx,
	input,
) => {
	const { channelId, ...query } = input;

	const result = await makeAblyRequest<
		AblyEndpointOutputs['getChannelPresence']
	>(`channels/${enc(channelId)}/presence`, ctx.key, {
		query,
	});

	await logEventFromContext(
		ctx,
		'ably.channels.getPresence',
		{ channelId },
		'completed',
	);

	return result;
};

export const getPresenceHistory: AblyEndpoints['getPresenceHistory'] = async (
	ctx,
	input,
) => {
	const { channelId, ...query } = input;

	const result = await makeAblyRequest<
		AblyEndpointOutputs['getPresenceHistory']
	>(`channels/${enc(channelId)}/presence/history`, ctx.key, {
		query,
	});

	await logEventFromContext(
		ctx,
		'ably.channels.getPresenceHistory',
		{ channelId },
		'completed',
	);

	return result;
};

export const getMessageVersions: AblyEndpoints['getMessageVersions'] = async (
	ctx,
	input,
) => {
	const result = await makeAblyRequest<
		AblyEndpointOutputs['getMessageVersions']
	>(
		`channels/${enc(input.channelId)}/messages/${enc(input.serial)}/versions`,
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'ably.channels.getMessageVersions',
		{ channelId: input.channelId },
		'completed',
	);

	return result;
};

export const listChannels: AblyEndpoints['listChannels'] = async (
	ctx,
	input,
) => {
	const { next, ...query } = input;
	const result = await makeAblyListRequest<
		AblyEndpointOutputs['listChannels']['items'][number]
	>('channels', ctx.key, {
		query: {
			...query,
			...next,
		},
	});

	await logEventFromContext(ctx, 'ably.channels.list', {}, 'completed');

	return result;
};

export const publishMessageToChannel: AblyEndpoints['publishMessageToChannel'] =
	async (ctx, input) => {
		const { channelId, ...body } = input;

		const result = await makeAblyRequest<
			AblyEndpointOutputs['publishMessageToChannel']
		>(`channels/${enc(channelId)}/messages`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'ably.channels.publishMessage',
			{ channelId },
			'completed',
		);

		return result;
	};

export const batchPresence: AblyEndpoints['batchPresence'] = async (
	ctx,
	input,
) => {
	const result = await makeAblyRequest<AblyEndpointOutputs['batchPresence']>(
		'presence',
		ctx.key,
		{
			query: {
				channels: input.channels.join(','),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'ably.channels.batchPresence',
		{},
		'completed',
	);

	return result;
};

export const batchPresenceHistory: AblyEndpoints['batchPresenceHistory'] =
	async (ctx, input) => {
		const { channels, ...query } = input;

		const results = new Array<
			AblyEndpointOutputs['batchPresenceHistory'][number]
		>(channels.length);

		let nextIndex = 0;

		const worker = async () => {
			while (true) {
				const index = nextIndex++;

				if (index >= channels.length) {
					return;
				}

				const channelId = channels[index]!;

				const history = await makeAblyRequest<
					AblyEndpointOutputs['getPresenceHistory']
				>(`channels/${enc(channelId)}/presence/history`, ctx.key, {
					query,
				});

				results[index] = {
					channelId,
					history,
				};
			}
		};

		const workerCount = Math.min(
			BATCH_PRESENCE_HISTORY_CONCURRENCY,
			channels.length,
		);

		await Promise.all(Array.from({ length: workerCount }, () => worker()));

		await logEventFromContext(
			ctx,
			'ably.channels.batchPresenceHistory',
			{},
			'completed',
		);

		return results;
	};
