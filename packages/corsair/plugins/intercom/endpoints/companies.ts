import { logEventFromContext } from '../../utils/events';
import type { IntercomEndpoints } from '..';
import { makeIntercomRequest } from '../client';
import type { IntercomEndpointOutputs } from './types';

export const createOrUpdate: IntercomEndpoints['companiesCreateOrUpdate'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesCreateOrUpdate']>(
		'companies',
		ctx.key,
		{
			method: 'POST',
			body: input as Record<string, unknown>,
		},
	);

	if (result && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save company to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.companies.createOrUpdate', {}, 'completed');
	return result;
};

export const get: IntercomEndpoints['companiesGet'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesGet']>(
		`companies/${input.id}`,
		ctx.key,
	);

	if (result && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save company to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.companies.get', { ...input }, 'completed');
	return result;
};

export const list: IntercomEndpoints['companiesList'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesList']>(
		'companies',
		ctx.key,
		{
			query: {
				page: input.page,
				per_page: input.per_page,
				order: input.order,
				tag_id: input.tag_id,
				segment_id: input.segment_id,
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

	await logEventFromContext(ctx, 'intercom.companies.list', { ...input }, 'completed');
	return result;
};

export const scroll: IntercomEndpoints['companiesScroll'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesScroll']>(
		'companies/scroll',
		ctx.key,
		{
			query: { scroll_param: input.scroll_param },
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

	await logEventFromContext(ctx, 'intercom.companies.scroll', { ...input }, 'completed');
	return result;
};

export const deleteCompany: IntercomEndpoints['companiesDelete'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesDelete']>(
		`companies/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(ctx, 'intercom.companies.delete', { ...input }, 'completed');
	return result;
};

export const retrieve: IntercomEndpoints['companiesRetrieve'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesRetrieve']>(
		'companies',
		ctx.key,
		{
			query: {
				company_id: input.company_id,
				name: input.name,
			},
		},
	);

	if (result && ctx.db.companies) {
		try {
			await ctx.db.companies.upsertByEntityId(result.id, result);
		} catch (error) {
			console.warn('Failed to save company to database:', error);
		}
	}

	await logEventFromContext(ctx, 'intercom.companies.retrieve', { ...input }, 'completed');
	return result;
};

export const listAttachedContacts: IntercomEndpoints['companiesListAttachedContacts'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesListAttachedContacts']>(
		`companies/${input.id}/contacts`,
		ctx.key,
		{
			query: {
				page: input.page,
				per_page: input.per_page,
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

	await logEventFromContext(ctx, 'intercom.companies.listAttachedContacts', { ...input }, 'completed');
	return result;
};

export const listAttachedSegments: IntercomEndpoints['companiesListAttachedSegments'] = async (ctx, input) => {
	const result = await makeIntercomRequest<IntercomEndpointOutputs['companiesListAttachedSegments']>(
		`companies/${input.id}/segments`,
		ctx.key,
	);

	await logEventFromContext(ctx, 'intercom.companies.listAttachedSegments', { ...input }, 'completed');
	return result;
};
