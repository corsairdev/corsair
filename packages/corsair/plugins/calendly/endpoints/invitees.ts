import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['inviteesGet'] = async (ctx, input) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesGet']
	>(
		`scheduled_events/${input.event_uuid}/invitees/${input.invitee_uuid}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result.resource && ctx.db.invitees) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.invitees.upsertByEntityId(id, {
				id,
				uri: result.resource.uri,
				email: result.resource.email,
				name: result.resource.name,
				status: result.resource.status,
				event: result.resource.event,
				timezone: result.resource.timezone,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save invitee to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.invitees.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: CalendlyEndpoints['inviteesList'] = async (ctx, input) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesList']
	>(`scheduled_events/${input.event_uuid}/invitees`, ctx.key, {
		method: 'GET',
		query: {
			status: input.status,
			count: input.count,
			page_token: input.page_token,
			sort: input.sort,
			email: input.email,
		},
	});

	if (result.collection && ctx.db.invitees) {
		try {
			for (const invitee of result.collection) {
				const uriParts = invitee.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
				await ctx.db.invitees.upsertByEntityId(id, {
					id,
					uri: invitee.uri,
					email: invitee.email,
					name: invitee.name,
					status: invitee.status,
					event: invitee.event,
					timezone: invitee.timezone,
					created_at: invitee.created_at ? new Date(invitee.created_at) : null,
					updated_at: invitee.updated_at ? new Date(invitee.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save invitees to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.invitees.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: CalendlyEndpoints['inviteesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesCreate']
	>(
		`one_off_event_types/${input.event_type_uuid}/invitees`,
		ctx.key,
		{
			method: 'POST',
			body: {
				email: input.email,
				name: input.name,
				timezone: input.timezone,
				additional_guests: input.additional_guests,
				questions_and_answers: input.questions_and_answers,
			},
		},
	);

	if (result.resource && ctx.db.invitees) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.invitees.upsertByEntityId(id, {
				id,
				uri: result.resource.uri,
				email: result.resource.email,
				name: result.resource.name,
				status: result.resource.status,
				event: result.resource.event,
				timezone: result.resource.timezone,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save invitee to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.invitees.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteData: CalendlyEndpoints['inviteesDeleteData'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesDeleteData']
	>('data_compliance/deletion/invitees', ctx.key, {
		method: 'POST',
		body: {
			emails: input.emails,
		},
	});

	await logEventFromContext(
		ctx,
		'calendly.invitees.deleteData',
		{ ...input },
		'completed',
	);
	return result;
};

export const getNoShow: CalendlyEndpoints['inviteesGetNoShow'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesGetNoShow']
	>(`invitee_no_shows/${input.uuid}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'calendly.invitees.getNoShow',
		{ ...input },
		'completed',
	);
	return result;
};

export const markNoShow: CalendlyEndpoints['inviteesMarkNoShow'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesMarkNoShow']
	>('invitee_no_shows', ctx.key, {
		method: 'POST',
		body: {
			invitee: input.invitee,
		},
	});

	await logEventFromContext(
		ctx,
		'calendly.invitees.markNoShow',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteNoShow: CalendlyEndpoints['inviteesDeleteNoShow'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesDeleteNoShow']
	>(`invitee_no_shows/${input.uuid}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'calendly.invitees.deleteNoShow',
		{ ...input },
		'completed',
	);
	return result;
};
