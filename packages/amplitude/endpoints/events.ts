import { logEventFromContext } from 'corsair/core';
import type { AmplitudeEndpoints } from '..';
import { AMPLITUDE_HTTP_API_BASE, makeAmplitudeRequest } from '../client';
import type { AmplitudeEndpointOutputs } from './types';

export const upload: AmplitudeEndpoints['eventsUpload'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['eventsUpload']
	>('/2/httpapi', ctx.key, {
		method: 'POST',
		body: {
			api_key: input.api_key,
			events: input.events,
			options: input.options,
		},
		baseUrl: AMPLITUDE_HTTP_API_BASE,
	});

	if (ctx.db.events && input.events.length > 0) {
		try {
			for (const event of input.events) {
				const entityId =
					event.insert_id ??
					[
						event.event_type,
						event.user_id ?? event.device_id ?? '',
						String(event.time ?? Date.now()),
					].join(':');
				await ctx.db.events.upsertByEntityId(entityId, {
					...event,
					id: entityId,
					createdAt: event.time ? new Date(event.time) : new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save events to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.events.upload',
		{ ...input },
		'completed',
	);
	return result;
};

export const uploadBatch: AmplitudeEndpoints['eventsUploadBatch'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['eventsUploadBatch']
	>('/batch', ctx.key, {
		method: 'POST',
		body: {
			api_key: input.api_key,
			events: input.events,
			options: input.options,
		},
		baseUrl: AMPLITUDE_HTTP_API_BASE,
	});

	if (ctx.db.events && input.events.length > 0) {
		try {
			for (const event of input.events) {
				const entityId =
					event.insert_id ??
					[
						event.event_type,
						event.user_id ?? event.device_id ?? '',
						String(event.time ?? Date.now()),
					].join(':');
				await ctx.db.events.upsertByEntityId(entityId, {
					...event,
					id: entityId,
					createdAt: event.time ? new Date(event.time) : new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save events to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.events.uploadBatch',
		{ ...input },
		'completed',
	);
	return result;
};

export const identifyUser: AmplitudeEndpoints['eventsIdentifyUser'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['eventsIdentifyUser']
	>('/identify', ctx.key, {
		method: 'POST',
		body: {
			api_key: input.api_key,
			identification: input.identification,
		},
		baseUrl: AMPLITUDE_HTTP_API_BASE,
	});

	if (ctx.db.users && input.identification.length > 0) {
		try {
			for (const identify of input.identification) {
				const userId = identify.user_id ?? identify.device_id;
				if (userId) {
					await ctx.db.users.upsertByEntityId(userId, {
						id: userId,
						user_id: identify.user_id,
						user_properties: identify.user_properties,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'amplitude.events.identifyUser',
		{ ...input },
		'completed',
	);
	return result;
};

export const getList: AmplitudeEndpoints['eventsGetList'] = async (
	ctx,
	input,
) => {
	const result = await makeAmplitudeRequest<
		AmplitudeEndpointOutputs['eventsGetList']
	>('/api/2/events/list', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'amplitude.events.getList',
		{ ...input },
		'completed',
	);
	return result;
};
