import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['usersGet'] = async (ctx, input) => {
	const result = await makeCalendlyRequest<CalendlyEndpointOutputs['usersGet']>(
		`users/${input.uuid}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.resource && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(input.uuid, {
				id: input.uuid,
				uri: result.resource.uri,
				name: result.resource.name,
				slug: result.resource.slug,
				email: result.resource.email,
				scheduling_url: result.resource.scheduling_url,
				timezone: result.resource.timezone,
				avatar_url: result.resource.avatar_url,
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
				uri: result.resource.uri,
				name: result.resource.name,
				slug: result.resource.slug,
				email: result.resource.email,
				scheduling_url: result.resource.scheduling_url,
				timezone: result.resource.timezone,
				avatar_url: result.resource.avatar_url,
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

	await logEventFromContext(
		ctx,
		'calendly.users.getCurrent',
		{},
		'completed',
	);
	return result;
};

export const getAvailabilitySchedule: CalendlyEndpoints['usersGetAvailabilitySchedule'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['usersGetAvailabilitySchedule']
		>(`user_availability_schedules/${input.uuid}`, ctx.key, {
			method: 'GET',
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
			query: {
				user: input.user,
			},
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
		query: {
			user: input.user,
			start_time: input.start_time,
			end_time: input.end_time,
		},
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
			query: {
				user: input.user,
			},
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
		query: {
			user: input.user,
			organization: input.organization,
			count: input.count,
			page_token: input.page_token,
			active: input.active,
		},
	});

	if (result.collection && ctx.db.eventTypes) {
		try {
			for (const eventType of result.collection) {
				const uriParts = eventType.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
				await ctx.db.eventTypes.upsertByEntityId(id, {
					id,
					uri: eventType.uri,
					name: eventType.name,
					active: eventType.active,
					slug: eventType.slug,
					scheduling_url: eventType.scheduling_url,
					duration: eventType.duration,
					kind: eventType.kind,
					color: eventType.color,
					description_plain: eventType.description_plain,
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
