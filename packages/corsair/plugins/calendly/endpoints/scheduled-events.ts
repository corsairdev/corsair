import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['scheduledEventsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['scheduledEventsGet']
	>(`scheduled_events/${input.uuid}`, ctx.key, {
		method: 'GET',
	});

	if (result.resource && ctx.db.scheduledEvents) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.scheduledEvents.upsertByEntityId(id, {
				id,
				uri: result.resource.uri,
				name: result.resource.name,
				status: result.resource.status,
				start_time: result.resource.start_time,
				end_time: result.resource.end_time,
				event_type: result.resource.event_type,
				location: result.resource.location,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save scheduled event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.scheduledEvents.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: CalendlyEndpoints['scheduledEventsList'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['scheduledEventsList']
	>('scheduled_events', ctx.key, {
		method: 'GET',
		query: {
			user: input.user,
			organization: input.organization,
			status: input.status,
			min_start_time: input.min_start_time,
			max_start_time: input.max_start_time,
			count: input.count,
			page_token: input.page_token,
			sort: input.sort,
			invitee_email: input.invitee_email,
		},
	});

	if (result.collection && ctx.db.scheduledEvents) {
		try {
			for (const event of result.collection) {
				const uriParts = event.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.scheduledEvents.upsertByEntityId(id, {
					id,
					uri: event.uri,
					name: event.name,
					status: event.status,
					start_time: event.start_time,
					end_time: event.end_time,
					event_type: event.event_type,
					location: event.location,
					created_at: event.created_at ? new Date(event.created_at) : null,
					updated_at: event.updated_at ? new Date(event.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save scheduled events to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.scheduledEvents.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const cancel: CalendlyEndpoints['scheduledEventsCancel'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['scheduledEventsCancel']
	>(`scheduled_events/${input.uuid}/cancellation`, ctx.key, {
		method: 'POST',
		body: {
			reason: input.reason,
		},
	});

	if (ctx.db.scheduledEvents) {
		try {
			const existing = await ctx.db.scheduledEvents.findByEntityId(input.uuid);
			if (existing) {
				await ctx.db.scheduledEvents.upsertByEntityId(input.uuid, {
					...existing.data,
					status: 'canceled',
				});
			}
		} catch (error) {
			console.warn('Failed to update canceled event in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.scheduledEvents.cancel',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteData: CalendlyEndpoints['scheduledEventsDeleteData'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['scheduledEventsDeleteData']
		>('data_compliance/deletion/scheduled_events', ctx.key, {
			method: 'POST',
			body: {
				start_time: input.start_time,
				end_time: input.end_time,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.scheduledEvents.deleteData',
			{ ...input },
			'completed',
		);
		return result;
	};
