import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['inviteesGet'] = async (ctx, input) => {
	const { event_uuid, invitee_uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesGet']
	>(`scheduled_events/${event_uuid}/invitees/${invitee_uuid}`, ctx.key, {
		method: 'GET',
		query,
	});

	if (result.resource && ctx.db.invitees) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.invitees.upsertByEntityId(id, {
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
	const { event_uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesList']
	>(`scheduled_events/${event_uuid}/invitees`, ctx.key, {
		method: 'GET',
		query,
	});

	if (result.collection && ctx.db.invitees) {
		try {
			for (const invitee of result.collection) {
				const uriParts = invitee.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.invitees.upsertByEntityId(id, {
					id,
					...invitee,
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
	const { event_type_uuid, ...body } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesCreate']
	>(`one_off_event_types/${event_type_uuid}/invitees`, ctx.key, {
		method: 'POST',
		body,
	});

	if (result.resource && ctx.db.invitees) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.invitees.upsertByEntityId(id, {
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
		body: input,
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
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesGetNoShow']
	>(`invitee_no_shows/${uuid}`, ctx.key, {
		query,
		method: 'GET',
	});

	if (result.resource?.invitee && ctx.db.invitees) {
		try {
			const uriParts = result.resource.invitee.split('/');
			const inviteeId = uriParts[uriParts.length - 1]!;
			const existing = await ctx.db.invitees.findByEntityId(inviteeId);
			if (existing) {
				await ctx.db.invitees.upsertByEntityId(inviteeId, {
					...existing.data,
					updated_at: result.resource.updated_at
						? new Date(result.resource.updated_at)
						: null,
				});
			}
		} catch (error) {
			console.warn(
				'Failed to update invitee from no-show record in database:',
				error,
			);
		}
	}

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
		body: input,
	});

	if (result.resource?.invitee && ctx.db.invitees) {
		try {
			const uriParts = result.resource.invitee.split('/');
			const inviteeId = uriParts[uriParts.length - 1]!;
			const existing = await ctx.db.invitees.findByEntityId(inviteeId);
			if (existing) {
				await ctx.db.invitees.upsertByEntityId(inviteeId, {
					...existing.data,
					updated_at: result.resource.updated_at
						? new Date(result.resource.updated_at)
						: null,
				});
			}
		} catch (error) {
			console.warn('Failed to update invitee no-show in database:', error);
		}
	}

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
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['inviteesDeleteNoShow']
	>(`invitee_no_shows/${uuid}`, ctx.key, {
		query,
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
