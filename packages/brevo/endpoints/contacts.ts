import { logEventFromContext } from 'corsair/core';
import { makeBrevoRequest } from '../client';
import type { BrevoEndpoints } from '../index';
import type { Contact } from './types';
import { BrevoEndpointInputSchemas, BrevoEndpointOutputSchemas } from './types';

function isNumericIdentifier(identifier: string | number): boolean {
	return typeof identifier === 'number' || /^\d+$/.test(identifier);
}

function contactCacheFields(contact: Contact) {
	return {
		id: contact.id,
		email: contact.email ?? undefined,
		emailBlacklisted: contact.emailBlacklisted,
		smsBlacklisted: contact.smsBlacklisted,
		createdAt: contact.createdAt,
		modifiedAt: contact.modifiedAt,
		attributes: contact.attributes,
	};
}

export const list: BrevoEndpoints['contactsList'] = async (ctx, input) => {
	const parsed = BrevoEndpointInputSchemas.contactsList.parse(input);
	const query: Record<string, string | number | undefined> = {};
	if (parsed?.limit !== undefined) query.limit = parsed.limit;
	if (parsed?.offset !== undefined) query.offset = parsed.offset;
	if (parsed?.modifiedSince) query.modifiedSince = parsed.modifiedSince;
	if (parsed?.sort) query.sort = parsed.sort;
	if (parsed?.segmentId !== undefined) query.segmentId = parsed.segmentId;
	if (parsed?.listId !== undefined) query.listId = parsed.listId;

	const raw = await makeBrevoRequest<unknown>('contacts', ctx.key, {
		method: 'GET',
		query,
	});
	const response = BrevoEndpointOutputSchemas.contactsList.parse(raw);

	if (response.contacts && ctx.db?.contacts) {
		try {
			for (const contact of response.contacts) {
				await ctx.db.contacts.upsertByEntityId(
					String(contact.id),
					contactCacheFields(contact),
				);
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
	const parsed = BrevoEndpointInputSchemas.contactsGet.parse(input);
	const encodedIdentifier = encodeURIComponent(String(parsed.identifier));
	const raw = await makeBrevoRequest<unknown>(
		`contacts/${encodedIdentifier}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const response = BrevoEndpointOutputSchemas.contactsGet.parse(raw);

	if (response.id && ctx.db?.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(
				String(response.id),
				contactCacheFields(response),
			);
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
	const parsed = BrevoEndpointInputSchemas.contactsCreate.parse(input);
	const body: Record<string, unknown> = {};
	if (parsed.email !== undefined) body.email = parsed.email;
	if (parsed.ext_id !== undefined) body.ext_id = parsed.ext_id;
	if (parsed.attributes) body.attributes = parsed.attributes;
	if (parsed.emailBlacklisted !== undefined)
		body.emailBlacklisted = parsed.emailBlacklisted;
	if (parsed.smsBlacklisted !== undefined)
		body.smsBlacklisted = parsed.smsBlacklisted;
	if (parsed.listIds) body.listIds = parsed.listIds;
	if (parsed.updateEnabled !== undefined)
		body.updateEnabled = parsed.updateEnabled;
	if (parsed.smtpBlacklistSender)
		body.smtpBlacklistSender = parsed.smtpBlacklistSender;

	const raw = await makeBrevoRequest<unknown>('contacts', ctx.key, {
		method: 'POST',
		body,
	});
	const response = BrevoEndpointOutputSchemas.contactsCreate.parse(raw);

	if (response.id && ctx.db?.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(String(response.id), {
				id: response.id,
				email: parsed.email,
				emailBlacklisted: parsed.emailBlacklisted,
				smsBlacklisted: parsed.smsBlacklisted,
				attributes: parsed.attributes,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.contacts.create',
		{ id: response.id, email: parsed.email },
		'completed',
	);

	return response;
};

export const update: BrevoEndpoints['contactsUpdate'] = async (ctx, input) => {
	const parsed = BrevoEndpointInputSchemas.contactsUpdate.parse(input);
	const { identifier, ...fields } = parsed;
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
	await makeBrevoRequest<unknown>(`contacts/${encodedIdentifier}`, ctx.key, {
		method: 'PUT',
		body,
	});

	const refreshed = BrevoEndpointOutputSchemas.contactsGet.parse(
		await makeBrevoRequest<unknown>(`contacts/${encodedIdentifier}`, ctx.key, {
			method: 'GET',
		}),
	);

	if (ctx.db?.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(
				String(refreshed.id),
				contactCacheFields(refreshed),
			);
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.contacts.update',
		{ identifier: String(identifier) },
		'completed',
	);

	return BrevoEndpointOutputSchemas.contactsUpdate.parse({ success: true });
};

export const deleteContact: BrevoEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = BrevoEndpointInputSchemas.contactsDelete.parse(input);
	const encodedIdentifier = encodeURIComponent(String(parsed.identifier));

	let cachedId: string;
	if (isNumericIdentifier(parsed.identifier)) {
		cachedId = String(parsed.identifier);
	} else {
		const existing = BrevoEndpointOutputSchemas.contactsGet.parse(
			await makeBrevoRequest<unknown>(
				`contacts/${encodedIdentifier}`,
				ctx.key,
				{ method: 'GET' },
			),
		);
		cachedId = String(existing.id);
	}

	await makeBrevoRequest<unknown>(`contacts/${encodedIdentifier}`, ctx.key, {
		method: 'DELETE',
	});

	if (ctx.db?.contacts) {
		try {
			await ctx.db.contacts.deleteByEntityId(cachedId);
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'brevo.contacts.delete',
		{ identifier: String(parsed.identifier) },
		'completed',
	);

	return BrevoEndpointOutputSchemas.contactsDelete.parse({ success: true });
};
