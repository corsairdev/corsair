import { logEventFromContext } from '../../utils/events';
import type { HubSpotEndpoints } from '..';
import { makeHubSpotRequest } from '../client';
import type {
	CreateDealResponse,
	GetDealResponse,
	GetManyDealsResponse,
	UpdateDealResponse,
} from './types';

export const get: HubSpotEndpoints['dealsGet'] = async (ctx, input) => {
	const { dealId, ...queryParams } = input;
	const endpoint = `/crm/v3/objects/deals/${dealId}`;
	const result = await makeHubSpotRequest<GetDealResponse>(
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

	if (result && ctx.db.deals) {
		try {
			await ctx.db.deals.upsert(result.id,result);
		} catch (error) {
			console.warn('Failed to save deal to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.deals.get', { ...input }, 'completed');
	return result;
};

export const getMany: HubSpotEndpoints['dealsGetMany'] = async (ctx, input) => {
	const { ...queryParams } = input || {};
	const endpoint = '/crm/v3/objects/deals';
	const result = await makeHubSpotRequest<GetManyDealsResponse>(
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

	if (result.results && ctx.db.deals) {
		try {
			for (const deal of result.results) {
				await ctx.db.deals.upsert(deal.id, deal);
			}
		} catch (error) {
			console.warn('Failed to save deals to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.deals.getMany', { ...input }, 'completed');
	return result;
};

export const create: HubSpotEndpoints['dealsCreate'] = async (ctx, input) => {
	const { ...body } = input;
	const endpoint = '/crm/v3/objects/deals';
	const result = await makeHubSpotRequest<CreateDealResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	if (result && ctx.db.deals) {
		try {
			await ctx.db.deals.upsert(result.id, result);
		} catch (error) {
			console.warn('Failed to save deal to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.deals.create', { ...input }, 'completed');
	return result;
};

export const update: HubSpotEndpoints['dealsUpdate'] = async (ctx, input) => {
	const { dealId, ...body } = input;
	const endpoint = `/crm/v3/objects/deals/${dealId}`;
	const result = await makeHubSpotRequest<UpdateDealResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'PATCH', body },
	);

	if (result && ctx.db.deals) {
		try {
			await ctx.db.deals.upsert(result.id, result);
		} catch (error) {
			console.warn('Failed to update deal in database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.deals.update', { ...input }, 'completed');
	return result;
};

export const deleteDeal: HubSpotEndpoints['dealsDelete'] = async (ctx, input) => {
	const { dealId } = input;
	const endpoint = `/crm/v3/objects/deals/${dealId}`;
	await makeHubSpotRequest<void>(
		endpoint,
		ctx.options.token,
		{ method: 'DELETE' },
	);

	if (ctx.db.deals) {
		try {
			await ctx.db.deals.deleteByEntityId(dealId);
		} catch (error) {
			console.warn('Failed to delete deal from database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.deals.delete', { ...input }, 'completed');
};

export const getRecentlyCreated: HubSpotEndpoints['dealsGetRecentlyCreated'] = async (
	ctx,
	input,
) => {
	const { ...queryParams } = input || {};
	const endpoint = '/crm/v3/objects/deals';
	const result = await makeHubSpotRequest<GetManyDealsResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	await logEventFromContext(
		ctx,
		'hubspot.deals.getRecentlyCreated',
		{ ...input },
		'completed',
	);
	return result;
};

export const getRecentlyUpdated: HubSpotEndpoints['dealsGetRecentlyUpdated'] = async (
	ctx,
	input,
) => {
	const { ...queryParams } = input || {};
	const endpoint = '/crm/v3/objects/deals';
	const result = await makeHubSpotRequest<GetManyDealsResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	await logEventFromContext(
		ctx,
		'hubspot.deals.getRecentlyUpdated',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: HubSpotEndpoints['dealsSearch'] = async (ctx, input) => {
	const { ...body } = input;
	const endpoint = '/crm/v3/objects/deals/search';
	const result = await makeHubSpotRequest<GetManyDealsResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	await logEventFromContext(ctx, 'hubspot.deals.search', { ...input }, 'completed');
	return result;
};
