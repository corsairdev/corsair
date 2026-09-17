import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const create: DovetailEndpoints['channelsCreate'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: input.title,
		content_type: input.content_type,
	};
	if (input.project_category_id !== undefined) {
		body.project_category_id = input.project_category_id;
	}

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsCreate']
	>('/v1/channels', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.channels.create',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const update: DovetailEndpoints['channelsUpdate'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: input.title,
	};
	if (input.context !== undefined) {
		body.context = input.context;
	}

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsUpdate']
	>(`/v1/channels/${encodeURIComponent(input.channel_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.channels.update',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const deleteChannel: DovetailEndpoints['channelsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsDelete']
	>(`/v1/channels/${encodeURIComponent(input.channel_id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'dovetail.channels.delete',
		{ id: result.data.id, deleted: result.data.deleted },
		'completed',
	);
	return result;
};

export const createDataPoint: DovetailEndpoints['channelsCreateDataPoint'] =
	async (ctx, input) => {
		// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
		const body: Record<string, unknown> = {
			channel_id: input.channel_id,
			text: input.text,
		};
		if (input.timestamp !== undefined) body.timestamp = input.timestamp;
		if (input.source_title !== undefined)
			body.source_title = input.source_title;
		if (input.source_url !== undefined) body.source_url = input.source_url;
		if (input.metadata !== undefined) body.metadata = input.metadata;

		const result = await makeDovetailRequest<
			DovetailEndpointOutputs['channelsCreateDataPoint']
		>('/v1/channels/data', ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'dovetail.channels.createDataPoint',
			{ id: result.data.id },
			'completed',
		);
		return result;
	};

export const createTopic: DovetailEndpoints['channelsCreateTopic'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		channel_id: input.channel_id,
		title: input.title,
		description: input.description,
	};

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsCreateTopic']
	>('/v1/channels/topic', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.channels.createTopic',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const updateTopic: DovetailEndpoints['channelsUpdateTopic'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.title !== undefined) body.title = input.title;
	if (input.description !== undefined) body.description = input.description;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsUpdateTopic']
	>(`/v1/channels/topic/${encodeURIComponent(input.topic_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.channels.updateTopic',
		{ id: result.data.id, title: result.data.title },
		'completed',
	);
	return result;
};

export const deleteTopic: DovetailEndpoints['channelsDeleteTopic'] = async (
	ctx,
	input,
) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsDeleteTopic']
	>(`/v1/channels/topic/${encodeURIComponent(input.topic_id)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'dovetail.channels.deleteTopic',
		{ id: result.data.id, deleted: result.data.deleted },
		'completed',
	);
	return result;
};

export const Channels = {
	create,
	update,
	delete: deleteChannel,
	createDataPoint,
	createTopic,
	updateTopic,
	deleteTopic,
};
