import { logEventFromContext } from 'corsair/core';
import { makeBrevoRequest } from '../client';
import type { BrevoEndpoints } from '../index';
import type { BrevoEndpointOutputs } from './types';

export const list: BrevoEndpoints['contactsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit !== undefined) query.limit = input.limit;
	if (input?.offset !== undefined) query.offset = input.offset;
	if (input?.modifiedSince) query.modifiedSince = input.modifiedSince;
	if (input?.sort) query.sort = input.sort;
	if (input?.segmentId !== undefined) query.segmentId = input.segmentId;
	if (input?.listId !== undefined) query.listId = input.listId;

	const response = await makeBrevoRequest<BrevoEndpointOutputs['contactsList']>(
		'contacts',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (response.contacts && ctx.db?.contacts) {
		try {
			for (const contact of response.contacts) {
				await ctx.db?.contacts.upsertByEntityId(String(contact.id), {
					id: contact.id,
					email: contact.email,
					emailBlacklisted: contact.emailBlacklisted,
					smsBlacklisted: contact.smsBlacklisted,
					createdAt: contact.createdAt,
					modifiedAt: contact.modifiedAt,
					attributes: contact.attributes,
				});
			}
		} catch (error) {
			console.warn('Failed to save contacts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.contacts.list',
		{ count: response.count ?? response.contacts?.length ?? 0 },
		'completed',
	);

	return response;
};

export const get: BrevoEndpoints['contactsGet'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = {};
	if (input.attributes && input.attributes.length > 0) {
		query.attributes = input.attributes.join(',');
	}

	const encodedIdentifier = encodeURIComponent(String(input.identifier));
	const response = await makeBrevoRequest<BrevoEndpointOutputs['contactsGet']>(
		`contacts/${encodedIdentifier}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (response.id && ctx.db?.contacts) {
		try {
			await ctx.db?.contacts.upsertByEntityId(String(response.id), {
				id: response.id,
				email: response.email,
				emailBlacklisted: response.emailBlacklisted,
				smsBlacklisted: response.smsBlacklisted,
				createdAt: response.createdAt,
				modifiedAt: response.modifiedAt,
				attributes: response.attributes,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.contacts.get',
		{ id: response.id, email: response.email },
		'completed',
	);

	return response;
};

export const create: BrevoEndpoints['contactsCreate'] = async (ctx, input) => {
	const body: Record<string, unknown> = {
		email: input.email,
	};
	if (input.attributes) body.attributes = input.attributes;
	if (input.emailBlacklisted !== undefined)
		body.emailBlacklisted = input.emailBlacklisted;
	if (input.smsBlacklisted !== undefined)
		body.smsBlacklisted = input.smsBlacklisted;
	if (input.listIds) body.listIds = input.listIds;
	if (input.updateEnabled !== undefined)
		body.updateEnabled = input.updateEnabled;
	if (input.smtpBlacklistSender)
		body.smtpBlacklistSender = input.smtpBlacklistSender;

	const response = await makeBrevoRequest<
		BrevoEndpointOutputs['contactsCreate']
	>('contacts', ctx.key, {
		method: 'POST',
		body,
	});

	if (response.id && ctx.db?.contacts) {
		try {
			await ctx.db?.contacts.upsertByEntityId(String(response.id), {
				id: response.id,
				email: input.email,
				emailBlacklisted: input.emailBlacklisted,
				smsBlacklisted: input.smsBlacklisted,
				attributes: input.attributes,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.contacts.create',
		{ id: response.id, email: input.email },
		'completed',
	);

	return response;
};

export const update: BrevoEndpoints['contactsUpdate'] = async (ctx, input) => {
	const { identifier, ...fields } = input;
	const body: Record<string, unknown> = {};
	if (fields.attributes) body.attributes = fields.attributes;
	if (fields.emailBlacklisted !== undefined)
		body.emailBlacklisted = fields.emailBlacklisted;
	if (fields.smsBlacklisted !== undefined)
		body.smsBlacklisted = fields.smsBlacklisted;
	if (fields.listIds) body.listIds = fields.listIds;
	if (fields.unlinkListIds) body.unlinkListIds = fields.unlinkListIds;
	if (fields.smtpBlacklistSender)
		body.smtpBlacklistSender = fields.smtpBlacklistSender;

	const encodedIdentifier = encodeURIComponent(String(identifier));
	await makeBrevoRequest<void>(`contacts/${encodedIdentifier}`, ctx.key, {
		method: 'PUT',
		body,
	});

	await logEventFromContext(
		ctx,
		'brevo.contacts.update',
		{ identifier: String(identifier) },
		'completed',
	);

	return { success: true };
};

export const deleteContact: BrevoEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const encodedIdentifier = encodeURIComponent(String(input.identifier));
	await makeBrevoRequest<void>(`contacts/${encodedIdentifier}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db?.contacts) {
		try {
			await ctx.db?.contacts.deleteByEntityId(String(input.identifier));
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.contacts.delete',
		{ identifier: String(input.identifier) },
		'completed',
	);

	return { success: true };
};
