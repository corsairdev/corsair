import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['scheduledEventsGet'] = async (
	ctx,
	input,
) => {
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['scheduledEventsGet']
	>(`scheduled_events/${uuid}`, ctx.key, {
		query,
		method: 'GET',
	});

	if (result.resource && ctx.db.scheduledEvents) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.scheduledEvents.upsertByEntityId(id, {
				id,
				...result.resource,
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
		query: input,
	});

	if (result.collection && ctx.db.scheduledEvents) {
		try {
			for (const event of result.collection) {
				const uriParts = event.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.scheduledEvents.upsertByEntityId(id, {
					id,
					...event,
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
	const { uuid, ...body } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['scheduledEventsCancel']
	>(`scheduled_events/${uuid}/cancellation`, ctx.key, {
		method: 'POST',
		body,
	});

	if (ctx.db.scheduledEvents) {
		try {
			const existing = await ctx.db.scheduledEvents.findByEntityId(uuid);
			if (existing) {
				await ctx.db.scheduledEvents.upsertByEntityId(uuid, {
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
			body: input,
		});

		await logEventFromContext(
			ctx,
			'calendly.scheduledEvents.deleteData',
			{ ...input },
			'completed',
		);
		return result;
	};
