import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { saveCampaigns } from './store';

export const list: InstantlyEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		'campaignsList',
		'campaigns.list',
		input,
		({ tag_ids, ...query }) => ({
			method: 'GET',
			path: '/campaigns',
			query: { ...query, tag_ids: tag_ids?.join(',') },
		}),
		{
			log: (_, result) => ({ count: result.items.length }),
			after: (result) => saveCampaigns(ctx, result.items),
		},
	);

export const get: InstantlyEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		'campaignsGet',
		'campaigns.get',
		input,
		({ id }) => ({ method: 'GET', path: `/campaigns/${segment(id)}` }),
		{
			log: ({ id }) => ({ campaignId: id }),
			after: (result) => saveCampaigns(ctx, [result]),
		},
	);

// A new campaign is a draft (status 0) until campaigns.activate.
export const create: InstantlyEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		'campaignsCreate',
		'campaigns.create',
		input,
		(body) => ({ method: 'POST', path: '/campaigns', body }),
		{
			log: (_, result) => ({ campaignId: result.id }),
			after: (result) => saveCampaigns(ctx, [result]),
		},
	);

export const update: InstantlyEndpoints['campaignsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'campaignsUpdate',
		'campaigns.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/campaigns/${segment(id)}`,
			body,
		}),
		{
			log: ({ id, ...changes }) => ({
				campaignId: id,
				fields: Object.keys(changes).join(','),
			}),
			after: (result) => saveCampaigns(ctx, [result]),
		},
	);

// Starts (or resumes) sending real email to the campaign's leads.
export const activate: InstantlyEndpoints['campaignsActivate'] = (ctx, input) =>
	call(
		ctx,
		'campaignsActivate',
		'campaigns.activate',
		input,
		({ id }) => ({
			method: 'POST',
			path: `/campaigns/${segment(id)}/activate`,
		}),
		{
			log: ({ id }, result) => ({ campaignId: id, status: result.status }),
			after: (result) => saveCampaigns(ctx, [result]),
		},
	);

export const pause: InstantlyEndpoints['campaignsPause'] = (ctx, input) =>
	call(
		ctx,
		'campaignsPause',
		'campaigns.pause',
		input,
		({ id }) => ({ method: 'POST', path: `/campaigns/${segment(id)}/pause` }),
		{
			log: ({ id }, result) => ({ campaignId: id, status: result.status }),
			after: (result) => saveCampaigns(ctx, [result]),
		},
	);

export const getAnalytics: InstantlyEndpoints['campaignsGetAnalytics'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'campaignsGetAnalytics',
		'campaigns.getAnalytics',
		input,
		// `ids` repeats as ?ids=a&ids=b, which Instantly expects.
		(query) => ({ method: 'GET', path: '/campaigns/analytics', query }),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const getAnalyticsOverview: InstantlyEndpoints['campaignsGetAnalyticsOverview'] =
	(ctx, input) =>
		call(
			ctx,
			'campaignsGetAnalyticsOverview',
			'campaigns.getAnalyticsOverview',
			input,
			(query) => ({
				method: 'GET',
				path: '/campaigns/analytics/overview',
				query,
			}),
			{ log: ({ id }) => ({ campaignId: id }) },
		);

export const getStepAnalytics: InstantlyEndpoints['campaignsGetStepAnalytics'] =
	(ctx, input) =>
		call(
			ctx,
			'campaignsGetStepAnalytics',
			'campaigns.getStepAnalytics',
			input,
			(query) => ({
				method: 'GET',
				path: '/campaigns/analytics/steps',
				query,
			}),
			{
				log: ({ campaign_id }, result) => ({
					campaignId: campaign_id,
					rows: result.length,
				}),
			},
		);
