import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['eventTypesGet'] = async (ctx, input) => {
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['eventTypesGet']
	>(`event_types/${uuid}`, ctx.key, {
		query,
		method: 'GET',
	});

	if (result.resource && ctx.db.eventTypes) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.eventTypes.upsertByEntityId(id, {
				id,
				...result.resource,
				description_plain: result.resource.description_plain ?? '',
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save event type to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.eventTypes.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: CalendlyEndpoints['eventTypesList'] = async (ctx, input) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['eventTypesList']
	>('event_types', ctx.key, {
		method: 'GET',
		query: input,
	});

	if (result.collection && ctx.db.eventTypes) {
		try {
			for (const eventType of result.collection) {
				const uriParts = eventType.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.eventTypes.upsertByEntityId(id, {
					id,
					...eventType,
					description_plain: eventType.description_plain ?? '',
					created_at: eventType.created_at
						? new Date(eventType.created_at)
						: null,
					updated_at: eventType.updated_at
						? new Date(eventType.updated_at)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to save event types to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.eventTypes.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: CalendlyEndpoints['eventTypesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['eventTypesCreate']
	>('event_types', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.resource && ctx.db.eventTypes) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.eventTypes.upsertByEntityId(id, {
				id,
				...result.resource,
				description_plain: result.resource.description_plain ?? '',
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save event type to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.eventTypes.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const createOneOff: CalendlyEndpoints['eventTypesCreateOneOff'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['eventTypesCreateOneOff']
	>('one_off_event_types', ctx.key, {
		method: 'POST',
		body: input,
	});

	if (result.resource?.uri && ctx.db.eventTypes) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.eventTypes.upsertByEntityId(id, {
				id,
				uri: result.resource.uri,
				scheduling_url: result.resource.scheduling_url,
			});
		} catch (error) {
			console.warn('Failed to save one-off event type to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.eventTypes.createOneOff',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: CalendlyEndpoints['eventTypesUpdate'] = async (
	ctx,
	input,
) => {
	const { uuid, ...body } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['eventTypesUpdate']
	>(`event_types/${uuid}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	if (result.resource && ctx.db.eventTypes) {
		try {
			await ctx.db.eventTypes.upsertByEntityId(uuid, {
				id: uuid,
				...result.resource,
				description_plain: result.resource.description_plain ?? '',
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to update event type in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.eventTypes.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const updateAvailability: CalendlyEndpoints['eventTypesUpdateAvailability'] =
	async (ctx, input) => {
		const { uuid: _, ...body } = input;
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['eventTypesUpdateAvailability']
		>(`event_types/${input.uuid}/user_availability_schedule`, ctx.key, {
			method: 'POST',
			body,
		});

		await logEventFromContext(
			ctx,
			'calendly.eventTypes.updateAvailability',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listAvailableTimes: CalendlyEndpoints['eventTypesListAvailableTimes'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['eventTypesListAvailableTimes']
		>('event_type_available_times', ctx.key, {
			method: 'GET',
			query: input,
		});

		await logEventFromContext(
			ctx,
			'calendly.eventTypes.listAvailableTimes',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listHosts: CalendlyEndpoints['eventTypesListHosts'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['eventTypesListHosts']
	>('event_type_memberships', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'calendly.eventTypes.listHosts',
		{ ...input },
		'completed',
	);
	return result;
};
