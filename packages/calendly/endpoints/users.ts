import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['usersGet'] = async (ctx, input) => {
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<CalendlyEndpointOutputs['usersGet']>(
		`users/${uuid}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (result.resource && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(uuid, {
				id: uuid,
				...result.resource,
				avatar_url: result.resource.avatar_url ?? undefined,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.users.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getCurrent: CalendlyEndpoints['usersGetCurrent'] = async (
	ctx,
	_input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['usersGetCurrent']
	>('users/me', ctx.key, {
		method: 'GET',
	});

	if (result.resource && ctx.db.users) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.users.upsertByEntityId(id, {
				id,
				...result.resource,
				avatar_url: result.resource.avatar_url ?? undefined,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save current user to database:', error);
		}
	}

	await logEventFromContext(ctx, 'calendly.users.getCurrent', {}, 'completed');
	return result;
};

export const getAvailabilitySchedule: CalendlyEndpoints['usersGetAvailabilitySchedule'] =
	async (ctx, input) => {
		const { uuid, ...query } = input;
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['usersGetAvailabilitySchedule']
		>(`user_availability_schedules/${uuid}`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'calendly.users.getAvailabilitySchedule',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listAvailabilitySchedules: CalendlyEndpoints['usersListAvailabilitySchedules'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['usersListAvailabilitySchedules']
		>('user_availability_schedules', ctx.key, {
			method: 'GET',
			query: input,
		});

		await logEventFromContext(
			ctx,
			'calendly.users.listAvailabilitySchedules',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listBusyTimes: CalendlyEndpoints['usersListBusyTimes'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['usersListBusyTimes']
	>('user_busy_times', ctx.key, {
		method: 'GET',
		query: input,
	});

	await logEventFromContext(
		ctx,
		'calendly.users.listBusyTimes',
		{ ...input },
		'completed',
	);
	return result;
};

export const listMeetingLocations: CalendlyEndpoints['usersListMeetingLocations'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['usersListMeetingLocations']
		>('user_meeting_locations', ctx.key, {
			method: 'GET',
			query: input,
		});

		await logEventFromContext(
			ctx,
			'calendly.users.listMeetingLocations',
			{ ...input },
			'completed',
		);
		return result;
	};

export const listEventTypes: CalendlyEndpoints['usersListEventTypes'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['usersListEventTypes']
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
			console.warn('Failed to save user event types to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.users.listEventTypes',
		{ ...input },
		'completed',
	);
	return result;
};
