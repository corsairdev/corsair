import type { EnginemailerCampaignEndpoints } from '..';
import { makeEnginemailerRequest } from '../client';
import type { EnginemailerEndpointOutputs } from './types';

const get = <T>(
	ctx: { key: string },
	path: string,
	// Campaign query parameters vary by operation and are validated by schemas.
	query?: Record<string, unknown>,
) =>
	makeEnginemailerRequest<T>(path, ctx.key, {
		method: 'GET',
		query: query as Record<
			string,
			string | number | boolean | string[] | undefined
		>,
	});

const post = <T>(
	ctx: { key: string },
	path: string,
	// Campaign content and recipient-list payloads are provider-defined JSON.
	body: Record<string, unknown>,
) => makeEnginemailerRequest<T>(path, ctx.key, { method: 'POST', body });

export const campaignEndpoints: EnginemailerCampaignEndpoints = {
	listCampaigns: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['listCampaigns']>(
			ctx,
			'/restapi/campaign/emcampaign/ListCampaign',
			input,
		),
	createCampaign: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['createCampaign']>(
			ctx,
			'/restapi/Campaign/EMCampaign/CreateCampaign',
			input,
		),
	updateCampaign: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['updateCampaign']>(
			ctx,
			'/restapi/Campaign/EMCampaign/UpdateCampaign',
			input,
		),
	deleteCampaign: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['deleteCampaign']>(
			ctx,
			'/restapi/campaign/emcampaign/deletecampaign',
			input,
		),
	assignRecipientList: async (ctx, input) =>
		post<EnginemailerEndpointOutputs['assignRecipientList']>(
			ctx,
			'/restapi/campaign/emcampaign/AssignRecipientList',
			input,
		),
	deleteRecipientList: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['deleteRecipientList']>(
			ctx,
			'/restapi/campaign/emcampaign/deleteRecipientList',
			input,
		),
	pauseCampaign: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['pauseCampaign']>(
			ctx,
			'/restapi/campaign/emcampaign/PauseCampaign',
			input,
		),
	sendCampaign: async (ctx, input) =>
		get<EnginemailerEndpointOutputs['sendCampaign']>(
			ctx,
			'/restapi/campaign/emcampaign/SendCampaign',
			input,
		),
};
