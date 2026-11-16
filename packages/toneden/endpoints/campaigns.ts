import type { ToneDenEndpoints } from '..';
import { segment } from '../client';
import { call, writeBody } from './call';
import {
	ToneDenEndpointInputSchemas,
	ToneDenEndpointOutputSchemas,
} from './types';

export const list: ToneDenEndpoints['campaignsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: ToneDenEndpointInputSchemas.listCampaigns,
			output: ToneDenEndpointOutputSchemas.listCampaigns,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `users/${segment(parsed.user_id)}/advertising/campaigns`,
			query: { offset: parsed.offset, limit: parsed.limit },
		}),
		{
			log: (parsed, result) => ({
				user_id: parsed.user_id,
				campaigns: result.ad_campaigns.length,
			}),
		},
	);

export const get: ToneDenEndpoints['campaignsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: ToneDenEndpointInputSchemas.getCampaign,
			output: ToneDenEndpointOutputSchemas.getCampaign,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `advertising/campaigns/${segment(parsed.campaign_id)}`,
		}),
		{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
	);

export const create: ToneDenEndpoints['campaignsCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: ToneDenEndpointInputSchemas.createCampaign,
			output: ToneDenEndpointOutputSchemas.createCampaign,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'advertising/campaigns',
			body: writeBody(parsed as Record<string, unknown>, []),
		}),
		{ log: (parsed) => ({ target_type: parsed.target_type }) },
	);

export const update: ToneDenEndpoints['campaignsUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.update',
			input: ToneDenEndpointInputSchemas.updateCampaign,
			output: ToneDenEndpointOutputSchemas.updateCampaign,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `advertising/campaigns/${segment(parsed.campaign_id)}`,
			body: writeBody(parsed as Record<string, unknown>, ['campaign_id']),
		}),
		{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
	);

export const remove: ToneDenEndpoints['campaignsDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.delete',
			input: ToneDenEndpointInputSchemas.deleteCampaign,
			output: ToneDenEndpointOutputSchemas.deleteCampaign,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `advertising/campaigns/${segment(parsed.campaign_id)}`,
		}),
		{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
	);

export const insights: ToneDenEndpoints['campaignsInsights'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.insights',
			input: ToneDenEndpointInputSchemas.campaignInsights,
			output: ToneDenEndpointOutputSchemas.campaignInsights,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `advertising/campaigns/${segment(parsed.campaign_id)}/insights`,
		}),
		{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
	);

export const creativeInsights: ToneDenEndpoints['campaignsCreativeInsights'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'campaigns.creativeInsights',
				input: ToneDenEndpointInputSchemas.campaignCreativeInsights,
				output: ToneDenEndpointOutputSchemas.campaignCreativeInsights,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `advertising/campaigns/${segment(parsed.campaign_id)}/creativeInsights`,
			}),
			{ log: (parsed) => ({ campaign_id: parsed.campaign_id }) },
		);

export const listUserLists: ToneDenEndpoints['userListsList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'userLists.list',
			input: ToneDenEndpointInputSchemas.listUserLists,
			output: ToneDenEndpointOutputSchemas.listUserLists,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `users/${segment(parsed.user_id)}/advertising/userLists`,
		}),
		{
			log: (parsed, result) => ({
				user_id: parsed.user_id,
				user_lists: result.user_lists.length,
			}),
		},
	);

export const createUserList: ToneDenEndpoints['userListsCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'userLists.create',
			input: ToneDenEndpointInputSchemas.createUserList,
			output: ToneDenEndpointOutputSchemas.createUserList,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'advertising/userLists',
			body: {
				external_ad_account_id: parsed.external_ad_account_id,
				type: parsed.type,
			},
		}),
		{ log: (parsed) => ({ type: parsed.type }) },
	);

export const updateUserListContacts: ToneDenEndpoints['userListsUpdateContacts'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'userLists.updateContacts',
				input: ToneDenEndpointInputSchemas.updateUserListContacts,
				output: ToneDenEndpointOutputSchemas.updateUserListContacts,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `advertising/userLists/${segment(parsed.list_id)}/contacts`,
				body: writeBody(parsed as Record<string, unknown>, ['list_id']),
			}),
			{
				log: (parsed) => ({
					list_id: parsed.list_id,
					added: parsed.add?.length ?? 0,
					removed: parsed.remove?.length ?? 0,
				}),
			},
		);

export const offlineConversions: ToneDenEndpoints['offlineConversions'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'offlineConversions.upload',
				input: ToneDenEndpointInputSchemas.offlineConversions,
				output: ToneDenEndpointOutputSchemas.offlineConversions,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: `users/${segment(parsed.user_id)}/advertising/offlineConversions`,
				// ToneDen takes the events as a bare array.
				body: parsed.events,
			}),
			{
				log: (parsed) => ({
					user_id: parsed.user_id,
					events: parsed.events.length,
				}),
			},
		);
