import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { withInstantlyTimezones } from './campaign-schedule';
import { forgetCampaigns, saveCampaigns } from './store';

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
		(body) => ({
			method: 'POST',
			path: '/campaigns',
			body: {
				...body,
				campaign_schedule: withInstantlyTimezones(body.campaign_schedule),
			},
		}),
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
		({ id, campaign_schedule, ...body }) => ({
			method: 'PATCH',
			path: `/campaigns/${segment(id)}`,
			body: {
				...body,
				campaign_schedule: campaign_schedule
					? withInstantlyTimezones(campaign_schedule)
					: undefined,
			},
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

export const remove: InstantlyEndpoints['campaignsDelete'] = (ctx, input) =>
	call(
		ctx,
		'campaignsDelete',
		'campaigns.delete',
		input,
		({ id }) => ({ method: 'DELETE', path: `/campaigns/${segment(id)}` }),
		{
			log: ({ id }) => ({ campaignId: id }),
			onSuccess: ({ id }) => forgetCampaigns(ctx, [id]),
		},
	);

export const searchByLead: InstantlyEndpoints['campaignsSearchByLead'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'campaignsSearchByLead',
		'campaigns.searchByLead',
		input,
		(query) => ({ method: 'GET', path: '/campaigns/search-by-contact', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const getDailyAnalytics: InstantlyEndpoints['campaignsGetDailyAnalytics'] =
	(ctx, input) =>
		call(
			ctx,
			'campaignsGetDailyAnalytics',
			'campaigns.getDailyAnalytics',
			input,
			(query) => ({ method: 'GET', path: '/campaigns/analytics/daily', query }),
			{ log: (_, result) => ({ count: result.length }) },
		);

export const share: InstantlyEndpoints['campaignsShare'] = (ctx, input) =>
	call(
		ctx,
		'campaignsShare',
		'campaigns.share',
		input,
		({ id }) => ({ method: 'POST', path: `/campaigns/${segment(id)}/share` }),
		{ log: ({ id }) => ({ id }) },
	);

export const createFromShared: InstantlyEndpoints['campaignsCreateFromShared'] =
	(ctx, input) =>
		call(
			ctx,
			'campaignsCreateFromShared',
			'campaigns.createFromShared',
			input,
			({ id }) => ({
				method: 'POST',
				path: `/campaigns/${segment(id)}/from-export`,
			}),
			{ log: ({ id }) => ({ id }) },
		);

export const exportCampaign: InstantlyEndpoints['campaignsExport'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'campaignsExport',
		'campaigns.export',
		input,
		({ id }) => ({ method: 'POST', path: `/campaigns/${segment(id)}/export` }),
		{ log: ({ id }) => ({ id }) },
	);

export const duplicate: InstantlyEndpoints['campaignsDuplicate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'campaignsDuplicate',
		'campaigns.duplicate',
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: `/campaigns/${segment(id)}/duplicate`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const countLaunched: InstantlyEndpoints['campaignsCountLaunched'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'campaignsCountLaunched',
		'campaigns.countLaunched',
		input,
		() => ({ method: 'GET', path: '/campaigns/count-launched' }),
		{},
	);

export const addVariables: InstantlyEndpoints['campaignsAddVariables'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'campaignsAddVariables',
		'campaigns.addVariables',
		input,
		({ id, ...body }) => ({
			method: 'POST',
			path: `/campaigns/${segment(id)}/variables`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const getSendingStatus: InstantlyEndpoints['campaignsGetSendingStatus'] =
	(ctx, input) =>
		call(
			ctx,
			'campaignsGetSendingStatus',
			'campaigns.getSendingStatus',
			input,
			({ id, ...query }) => ({
				method: 'GET',
				path: `/campaigns/${segment(id)}/sending-status`,
				query,
			}),
			{ log: ({ id }) => ({ id }) },
		);
