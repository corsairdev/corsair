import { logEventFromContext } from '../../utils/events';
import type { HubSpotEndpoints } from '..';
import { makeHubSpotRequest } from '../client';
import type {
	CreateOrUpdateContactResponse,
	GetContactResponse,
	GetManyContactsResponse,
} from './types';

export const get: HubSpotEndpoints['contactsGet'] = async (ctx, input) => {
	const { contactId, ...queryParams } = input;
	const endpoint = `/crm/v3/objects/contacts/${contactId}`;
	const result = await makeHubSpotRequest<GetContactResponse>(
		endpoint,
		ctx.options.token,
		{
			query: {
				...queryParams,
				properties: queryParams.properties?.join(','),
				propertiesWithHistory: queryParams.propertiesWithHistory?.join(','),
				associations: queryParams.associations?.join(','),
			} as any,
		},
	);

	if (result && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsert(result.id, {
				id: result.id,
				properties: result.properties,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				archived: result.archived,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.contacts.get', { ...input }, 'completed');
	return result;
};

export const getMany: HubSpotEndpoints['contactsGetMany'] = async (ctx, input) => {
	const { ...queryParams } = input || {};
	const endpoint = '/crm/v3/objects/contacts';
	const result = await makeHubSpotRequest<GetManyContactsResponse>(
		endpoint,
		ctx.options.token,
		{
			query: {
				...queryParams,
				properties: queryParams.properties?.join(','),
				propertiesWithHistory: queryParams.propertiesWithHistory?.join(','),
				associations: queryParams.associations?.join(','),
			} as any,
		},
	);

	if (result.results && ctx.db.contacts) {
		try {
			for (const contact of result.results) {
				await ctx.db.contacts.upsert(contact.id, {
					id: contact.id,
					properties: contact.properties,
					createdAt: new Date(contact.createdAt),
					updatedAt: new Date(contact.updatedAt),
					archived: contact.archived,
				});
			}
		} catch (error) {
			console.warn('Failed to save contacts to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.contacts.getMany', { ...input }, 'completed');
	return result;
};

export const createOrUpdate: HubSpotEndpoints['contactsCreateOrUpdate'] = async (
	ctx,
	input,
) => {
	const { ...body } = input;
	const endpoint = '/crm/v3/objects/contacts';
	const result = await makeHubSpotRequest<CreateOrUpdateContactResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	if (result && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsert(result.id, {
				id: result.id,
				properties: result.properties,
				createdAt: new Date(result.createdAt),
				updatedAt: new Date(result.updatedAt),
				archived: result.archived,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hubspot.contacts.createOrUpdate',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteContact: HubSpotEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const { contactId } = input;
	const endpoint = `/crm/v3/objects/contacts/${contactId}`;
	await makeHubSpotRequest<void>(
		endpoint,
		ctx.options.token,
		{ method: 'DELETE' },
	);

	if (ctx.db.contacts) {
		try {
			await ctx.db.contacts.deleteByEntityId(contactId);
		} catch (error) {
			console.warn('Failed to delete contact from database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.contacts.delete', { ...input }, 'completed');
};

export const getRecentlyCreated: HubSpotEndpoints['contactsGetRecentlyCreated'] =
	async (ctx, input) => {
		const { ...queryParams } = input || {};
		const endpoint = '/crm/v3/objects/contacts';
		const result = await makeHubSpotRequest<GetManyContactsResponse>(
			endpoint,
			ctx.options.token,
			{ query: queryParams },
		);

		await logEventFromContext(
			ctx,
			'hubspot.contacts.getRecentlyCreated',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getRecentlyUpdated: HubSpotEndpoints['contactsGetRecentlyUpdated'] =
	async (ctx, input) => {
		const { ...queryParams } = input || {};
		const endpoint = '/crm/v3/objects/contacts';
		const result = await makeHubSpotRequest<GetManyContactsResponse>(
			endpoint,
			ctx.options.token,
			{ query: queryParams },
		);

		await logEventFromContext(
			ctx,
			'hubspot.contacts.getRecentlyUpdated',
			{ ...input },
			'completed',
		);
		return result;
	};

export const search: HubSpotEndpoints['contactsSearch'] = async (ctx, input) => {
	const { ...body } = input;
	const endpoint = '/crm/v3/objects/contacts/search';
	const result = await makeHubSpotRequest<GetManyContactsResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	await logEventFromContext(ctx, 'hubspot.contacts.search', { ...input }, 'completed');
	return result;
};
