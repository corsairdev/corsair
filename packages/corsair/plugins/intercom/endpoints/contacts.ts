import { logEventFromContext } from '../../utils/events';
import type { IntercomEndpoints } from '..';
import { makeIntercomRequest } from '../client';
import type { IntercomEndpointOutputs } from './types';

export const get: IntercomEndpoints['contactsGet'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsGet']>(
		`contacts/${input.id}`,
		ctx.key,
	);

	if (result && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.contacts.get', { ...input }, 'completed');
	return result;
};

export const list: IntercomEndpoints['contactsList'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsList']>(
		'contacts',
		ctx.key,
		{
			query: {
				page: input.page,
				per_page: input.per_page,
				starting_after: input.starting_after,
			},
		},
	);

	if (result?.data && ctx.db.contacts) {
		try {
			for (const contact of result.data) {
				await ctx.db.contacts.upsertByEntityId(contact.id, contact);
			}
		} catch (error) {
			console.warn('Failed to save contacts to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.contacts.list', { ...input }, 'completed');
	return result;
};

export const update: IntercomEndpoints['contactsUpdate'] = async (ctx, input) => {
	const { id, ...body } = input;
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsUpdate']>(
		`contacts/${id}`,
		ctx.key,
		{
			method: 'PUT',
			body: body as Record<string, unknown>,
		},
	);

	if (result && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to update contact in database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.contacts.update', { id }, 'completed');
	return result;
};

export const deleteContact: IntercomEndpoints['contactsDelete'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsDelete']>(
		`contacts/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'intercom.contacts.delete', { ...input }, 'completed');
	return result;
};

export const addTag: IntercomEndpoints['contactsAddTag'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsAddTag']>(
		`contacts/${input.contact_id}/tags`,
		ctx.key,
		{
			method: 'POST',
			body: { id: input.tag_id },
		},
	);

	await logEventFromContext(ctx, 'intercom.contacts.addTag', { ...input }, 'completed');
	return result;
};

export const removeTag: IntercomEndpoints['contactsRemoveTag'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsRemoveTag']>(
		`contacts/${input.contact_id}/tags/${input.tag_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'intercom.contacts.removeTag', { ...input }, 'completed');
	return result;
};

export const listTags: IntercomEndpoints['contactsListTags'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsListTags']>(
		`contacts/${input.contact_id}/tags`,
		ctx.key,
	);

	await logEventFromContext(ctx, 'intercom.contacts.listTags', { ...input }, 'completed');
	return result;
};

export const addSubscription: IntercomEndpoints['contactsAddSubscription'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsAddSubscription']>(
		`contacts/${input.contact_id}/subscriptions`,
		ctx.key,
		{
			method: 'POST',
			body: { id: input.id, consent_type: input.consent_type },
		},
	);

	await logEventFromContext(ctx, 'intercom.contacts.addSubscription', { ...input }, 'completed');
	return result;
};

export const removeSubscription: IntercomEndpoints['contactsRemoveSubscription'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsRemoveSubscription']>(
		`contacts/${input.contact_id}/subscriptions/${input.subscription_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'intercom.contacts.removeSubscription', { ...input }, 'completed');
	return result;
};

export const listSubscriptions: IntercomEndpoints['contactsListSubscriptions'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsListSubscriptions']>(
		`contacts/${input.contact_id}/subscriptions`,
		ctx.key,
	);

	await logEventFromContext(ctx, 'intercom.contacts.listSubscriptions', { ...input }, 'completed');
	return result;
};

export const attachToCompany: IntercomEndpoints['contactsAttachToCompany'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsAttachToCompany']>(
		`contacts/${input.contact_id}/companies`,
		ctx.key,
		{
			method: 'POST',
			body: { id: input.company_id },
		},
	);

	if (result && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save company to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.contacts.attachToCompany', { ...input }, 'completed');
	return result;
};

export const detachFromCompany: IntercomEndpoints['contactsDetachFromCompany'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsDetachFromCompany']>(
		`contacts/${input.contact_id}/companies/${input.company_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'intercom.contacts.detachFromCompany', { ...input }, 'completed');
	return result;
};

export const listAttachedCompanies: IntercomEndpoints['contactsListAttachedCompanies'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsListAttachedCompanies']>(
		`contacts/${input.contact_id}/companies`,
		ctx.key,
		{
			query: {
				page: input.page,
				per_page: input.per_page,
			},
		},
	);

	if (result?.data && ctx.db.companies) {
		try {
			for (const company of result.data) {
				await ctx.db.companies.upsertByEntityId(company.id, company);
			}
		} catch (error) {
			console.warn('Failed to save companies to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.contacts.listAttachedCompanies', { ...input }, 'completed');
	return result;
};

export const listAttachedSegments: IntercomEndpoints['contactsListAttachedSegments'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsListAttachedSegments']>(
		`contacts/${input.contact_id}/segments`,
		ctx.key,
	);

	await logEventFromContext(ctx, 'intercom.contacts.listAttachedSegments', { ...input }, 'completed');
	return result;
};

export const createNote: IntercomEndpoints['contactsCreateNote'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsCreateNote']>(
		`contacts/${input.contact_id}/notes`,
		ctx.key,
		{
			method: 'POST',
			body: {
				body: input.body,
				admin_id: input.admin_id,
			},
		},
	);

	await logEventFromContext(ctx, 'intercom.contacts.createNote', { contact_id: input.contact_id }, 'completed');
	return result;
};

export const listNotes: IntercomEndpoints['contactsListNotes'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsListNotes']>(
		`contacts/${input.contact_id}/notes`,
		ctx.key,
		{
			query: {
				page: input.page,
				per_page: input.per_page,
			},
		},
	);

	await logEventFromContext(ctx, 'intercom.contacts.listNotes', { ...input }, 'completed');
	return result;
};

export const merge: IntercomEndpoints['contactsMerge'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['contactsMerge']>(
		'contacts/merge',
		ctx.key,
		{
			method: 'POST',
			body: {
				from: input.lead_id,
				into: input.user_id,
			},
		},
	);

	if (result && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(result.id, {
				id: result.id,
				type: result.type,
				email: result.email,
				name: result.name,
				phone: result.phone,
				role: result.role,
				external_id: result.external_id,
				user_id: result.user_id,
				created_at: result.created_at,
				updated_at: result.updated_at,
				last_seen_at: result.last_seen_at,
				unsubscribed_from_emails: result.unsubscribed_from_emails,
			});
		} catch (error) {
			console.warn('Failed to save merged contact to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.contacts.merge', { ...input }, 'completed');
	return result;
};
