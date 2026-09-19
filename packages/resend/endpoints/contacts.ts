import { logEventFromContext } from 'corsair/core';
import { makeResendRequest } from '../client';
import type { ResendEndpoints } from '../index';
import type { ResendEndpointOutputs } from './types';

export const create: ResendEndpoints['contactsCreate'] = async (ctx, input) => {
	const body: Record<string, unknown> = {
		email: input.email,
	};
	if (input.first_name) body.first_name = input.first_name;
	if (input.last_name) body.last_name = input.last_name;
	if (input.unsubscribed !== undefined) body.unsubscribed = input.unsubscribed;
	if (input.properties) body.properties = input.properties;
	if (input.segments) body.segments = input.segments;
	if (input.topics) body.topics = input.topics;

	const response = await makeResendRequest<
		ResendEndpointOutputs['contactsCreate']
	>('contacts', ctx.key, {
		method: 'POST',
		body,
	});

	if (response.id && ctx.db?.contacts) {
		try {
			// POST /contacts returns only { object, id }; fetch the full
			// contact before upserting so the persisted row has email/etc.
			const fetched = await makeResendRequest<
				ResendEndpointOutputs['contactsGet']
			>(`contacts/${response.id}`, ctx.key, { method: 'GET' });
			await ctx.db?.contacts.upsertByEntityId(response.id, {
				id: fetched.id,
				email: fetched.email,
				first_name: fetched.first_name ?? null,
				last_name: fetched.last_name ?? null,
				created_at: fetched.created_at ?? null,
				unsubscribed: fetched.unsubscribed,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.contacts.create',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const get: ResendEndpoints['contactsGet'] = async (ctx, input) => {
	const response = await makeResendRequest<
		ResendEndpointOutputs['contactsGet']
	>(`contacts/${input.id}`, ctx.key, {
		method: 'GET',
	});

	if (response.id && ctx.db?.contacts) {
		try {
			await ctx.db?.contacts.upsertByEntityId(response.id, {
				id: response.id,
				email: response.email,
				first_name: response.first_name ?? null,
				last_name: response.last_name ?? null,
				created_at: response.created_at ?? null,
				unsubscribed: response.unsubscribed,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.contacts.get',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const list: ResendEndpoints['contactsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit) query.limit = input.limit;
	if (input?.cursor) query.cursor = input.cursor;

	const response = await makeResendRequest<
		ResendEndpointOutputs['contactsList']
	>('contacts', ctx.key, {
		method: 'GET',
		query,
	});

	if (response.data && ctx.db?.contacts) {
		try {
			for (const contact of response.data) {
				await ctx.db?.contacts.upsertByEntityId(contact.id, {
					...contact,
				});
			}
		} catch (error) {
			console.warn('Failed to save contacts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.contacts.list',
		input ? { limit: input.limit, cursor: input.cursor } : {},
		'completed',
	);
	return response;
};

export const update: ResendEndpoints['contactsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;

	const response = await makeResendRequest<
		ResendEndpointOutputs['contactsUpdate']
	>(`contacts/${id}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	if (response.id && ctx.db?.contacts) {
		try {
			// PATCH /contacts/:id returns only { object, id }; fetch the full
			// contact before upserting so the persisted row reflects the
			// updated email/name fields.
			const fetched = await makeResendRequest<
				ResendEndpointOutputs['contactsGet']
			>(`contacts/${response.id}`, ctx.key, { method: 'GET' });
			await ctx.db?.contacts.upsertByEntityId(response.id, {
				id: fetched.id,
				email: fetched.email,
				first_name: fetched.first_name ?? null,
				last_name: fetched.last_name ?? null,
				created_at: fetched.created_at ?? null,
				unsubscribed: fetched.unsubscribed,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.contacts.update',
		{ id: response.id },
		'completed',
	);
	return response;
};

export const deleteContact: ResendEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeResendRequest<
		ResendEndpointOutputs['contactsDelete']
	>(`contacts/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	if (response.deleted && ctx.db?.contacts) {
		try {
			await ctx.db?.contacts.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.contacts.delete',
		{ id: input.id },
		'completed',
	);
	return response;
};
