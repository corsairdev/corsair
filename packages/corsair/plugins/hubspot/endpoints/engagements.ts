import { logEventFromContext } from '../../utils/events';
import type { HubSpotEndpoints } from '..';
import { makeHubSpotRequest } from '../client';
import type {
	CreateEngagementResponse,
	GetEngagementResponse,
	GetManyEngagementsResponse,
} from './types';

export const get: HubSpotEndpoints['engagementsGet'] = async (ctx, input) => {
	const { engagementId } = input;
	const endpoint = `/crm/v3/objects/engagements/${engagementId}`;
	const result = await makeHubSpotRequest<GetEngagementResponse>(
		endpoint,
		ctx.options.token,
	);

	if (result && ctx.db.engagements) {
		try {
			await ctx.db.engagements.upsert(result.id, {
				id: result.id,
				engagement: result.engagement,
				associations: result.associations,
				metadata: result.metadata,
			});
		} catch (error) {
			console.warn('Failed to save engagement to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.engagements.get', { ...input }, 'completed');
	return result;
};

export const getMany: HubSpotEndpoints['engagementsGetMany'] = async (ctx, input) => {
	const { ...queryParams } = input || {};
	const endpoint = '/crm/v3/objects/engagements';
	const result = await makeHubSpotRequest<GetManyEngagementsResponse>(
		endpoint,
		ctx.options.token,
		{ query: queryParams },
	);

	if (result.results && ctx.db.engagements) {
		try {
			for (const engagement of result.results) {
				await ctx.db.engagements.upsert(engagement.id, {
					id: engagement.id,
					engagement: engagement.engagement,
					associations: engagement.associations,
					metadata: engagement.metadata,
				});
			}
		} catch (error) {
			console.warn('Failed to save engagements to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.engagements.getMany', { ...input }, 'completed');
	return result;
};

export const create: HubSpotEndpoints['engagementsCreate'] = async (ctx, input) => {
	const { ...body } = input;
	const endpoint = '/crm/v3/objects/engagements';
	const result = await makeHubSpotRequest<CreateEngagementResponse>(
		endpoint,
		ctx.options.token,
		{ method: 'POST', body },
	);

	if (result && ctx.db.engagements) {
		try {
			await ctx.db.engagements.upsert(result.id, {
				id: result.id,
				engagement: result.engagement,
				associations: result.associations,
				metadata: result.metadata,
			});
		} catch (error) {
			console.warn('Failed to save engagement to database:', error);
		}
	}

	await logEventFromContext(ctx, 'hubspot.engagements.create', { ...input }, 'completed');
	return result;
};

export const deleteEngagement: HubSpotEndpoints['engagementsDelete'] = async (
	ctx,
	input,
) => {
	const { engagementId } = input;
	const endpoint = `/crm/v3/objects/engagements/${engagementId}`;
	await makeHubSpotRequest<void>(
		endpoint,
		ctx.options.token,
		{ method: 'DELETE' },
	);

	if (ctx.db.engagements) {
		try {
			await ctx.db.engagements.deleteByEntityId(engagementId);
		} catch (error) {
			console.warn('Failed to delete engagement from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'hubspot.engagements.delete',
		{ ...input },
		'completed',
	);
};
