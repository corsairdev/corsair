import type { TeltelEndpoints } from '..';
import { call, filterParam, metaResultCall } from './call';
import {
	CampaignActionInputSchema,
	CampaignActionResponseSchema,
	CampaignCreateInputSchema,
	CampaignCreateResponseSchema,
	CampaignGetInputSchema,
	CampaignGetResponseSchema,
	CampaignsListInputSchema,
	CampaignsListResponseSchema,
	CampaignUpdateInputSchema,
	MetaResultSchema,
} from './types';

export const list: TeltelEndpoints['campaignsList'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'campaigns.list',
			input: CampaignsListInputSchema,
			output: CampaignsListResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: '/sms/campaigns',
			query: {
				limit: parsed.limit,
				offset: parsed.offset,
				sort: parsed.sort,
				filter: filterParam([['state', '=', parsed.state]]),
			},
		}),
	);
};

export const get: TeltelEndpoints['campaignsGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'campaigns.get',
			input: CampaignGetInputSchema,
			output: CampaignGetResponseSchema,
		},
		input,
		undefined,
		(parsed) => ({
			method: 'GET',
			path: `/sms/campaigns/${parsed.campaignId}`,
		}),
	);
};

export const create: TeltelEndpoints['campaignsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'campaigns.create',
			input: CampaignCreateInputSchema,
			output: CampaignCreateResponseSchema,
		},
		input,
		(parsed) => parsed,
		() => ({ method: 'POST', path: '/sms/campaigns' }),
	);
};

export const update: TeltelEndpoints['campaignsUpdate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'campaigns.update',
			input: CampaignUpdateInputSchema,
			output: MetaResultSchema,
		},
		input,
		(parsed) => {
			// The id belongs in the path, never in the body.
			const { campaignId, ...body } = parsed;
			return body;
		},
		(parsed) => ({
			method: 'PATCH',
			path: `/sms/campaigns/${parsed.campaignId}`,
		}),
	);
};

export const action: TeltelEndpoints['campaignsAction'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'campaigns.action',
			input: CampaignActionInputSchema,
			output: CampaignActionResponseSchema,
		},
		input,
		(parsed) => ({ action: parsed.action }),
		(parsed) => ({
			method: 'POST',
			path: `/sms/campaigns/${parsed.campaignId}/actions`,
		}),
	);
};

export const remove: TeltelEndpoints['campaignsRemove'] = async (
	ctx,
	input,
) => {
	return metaResultCall(
		ctx,
		{
			event: 'campaigns.remove',
			input: CampaignGetInputSchema,
			output: MetaResultSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/sms/campaigns/${parsed.campaignId}`,
		}),
	);
};
