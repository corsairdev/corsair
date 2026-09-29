import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const create: DovetailEndpoints['channelsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.channelsCreate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: parsed.title,
		content_type: parsed.content_type,
	};
	if (parsed.project_category_id !== undefined) {
		body.project_category_id = parsed.project_category_id;
	}

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsCreate']
	>('/v1/channels', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.channelsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.channels.create',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const update: DovetailEndpoints['channelsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.channelsUpdate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		title: parsed.title,
	};
	if (parsed.context !== undefined) {
		body.context = parsed.context;
	}

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsUpdate']
	>(`/v1/channels/${encodeURIComponent(parsed.channel_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.channelsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.channels.update',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const deleteChannel: DovetailEndpoints['channelsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.channelsDelete.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsDelete']
	>(`/v1/channels/${encodeURIComponent(parsed.channel_id)}`, ctx.key, {
		method: 'DELETE',
	});
	const validated =
		DovetailEndpointOutputSchemas.channelsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.channels.delete',
		{ id: validated.data.id, deleted: validated.data.deleted },
		'completed',
	);
	return validated;
};

export const createDataPoint: DovetailEndpoints['channelsCreateDataPoint'] =
	async (ctx, input) => {
		const parsed =
			DovetailEndpointInputSchemas.channelsCreateDataPoint.parse(input);
		// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
		const body: Record<string, unknown> = {
			channel_id: parsed.channel_id,
			text: parsed.text,
			timestamp: parsed.timestamp,
		};
		if (parsed.source_title !== undefined)
			body.source_title = parsed.source_title;
		if (parsed.source_url !== undefined) body.source_url = parsed.source_url;
		if (parsed.metadata !== undefined) body.metadata = parsed.metadata;

		const response = await makeDovetailRequest<
			DovetailEndpointOutputs['channelsCreateDataPoint']
		>('/v1/channels/data', ctx.key, {
			method: 'POST',
			body,
		});
		const validated =
			DovetailEndpointOutputSchemas.channelsCreateDataPoint.parse(response);

		await logEventFromContext(
			ctx,
			'dovetail.channels.createDataPoint',
			{ id: validated.data.id },
			'completed',
		);
		return validated;
	};

export const createTopic: DovetailEndpoints['channelsCreateTopic'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.channelsCreateTopic.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		channel_id: parsed.channel_id,
		title: parsed.title,
		description: parsed.description,
	};

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsCreateTopic']
	>('/v1/channels/topic', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.channelsCreateTopic.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.channels.createTopic',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const updateTopic: DovetailEndpoints['channelsUpdateTopic'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.channelsUpdateTopic.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (parsed.title !== undefined) body.title = parsed.title;
	if (parsed.description !== undefined) body.description = parsed.description;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsUpdateTopic']
	>(`/v1/channels/topic/${encodeURIComponent(parsed.topic_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.channelsUpdateTopic.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.channels.updateTopic',
		{ id: validated.data.id, title: validated.data.title },
		'completed',
	);
	return validated;
};

export const deleteTopic: DovetailEndpoints['channelsDeleteTopic'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.channelsDeleteTopic.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['channelsDeleteTopic']
	>(`/v1/channels/topic/${encodeURIComponent(parsed.topic_id)}`, ctx.key, {
		method: 'DELETE',
	});
	const validated =
		DovetailEndpointOutputSchemas.channelsDeleteTopic.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.channels.deleteTopic',
		{ id: validated.data.id, deleted: validated.data.deleted },
		'completed',
	);
	return validated;
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
