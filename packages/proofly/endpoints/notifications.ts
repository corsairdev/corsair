import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import {
	isProoflyFailure,
	prooflyFailure,
	prooflyGet,
	prooflyRequest,
} from '../client';
import type { ProoflyContext } from '../context';
import type {
	GetNotificationDataInput,
	GetNotificationDataResponse,
	ListNotificationsInput,
	ListNotificationsResponse,
	SetCampaignEnabledInput,
	SetCampaignEnabledResponse,
} from './types';
import {
	GetNotificationDataInputSchema,
	GetNotificationDataResponseSchema,
	ListCampaignsResponseSchema,
	ListNotificationsInputSchema,
	ListNotificationsResponseSchema,
	SetCampaignEnabledInputSchema,
	SetCampaignEnabledResponseSchema,
} from './types';

/** GET /campaign/{campaign_id}: the campaign's notifications with stats. */
export const listNotifications: CorsairEndpoint<
	ProoflyContext,
	ListNotificationsInput,
	ListNotificationsResponse
> = async (ctx, input) => {
	const { campaign_id } = ListNotificationsInputSchema.parse(input);
	const path = `/campaign/${encodeURIComponent(campaign_id)}`;
	const body = await prooflyGet<unknown>(ctx.key, path);
	if (isProoflyFailure(body)) throw prooflyFailure(path, body);
	const result = ListNotificationsResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'proofly.notifications.list',
		{ campaign_id, count: result.data.length },
		'completed',
	);
	return result;
};

/**
 * PUT /campaign/{campaign_id} flips a campaign between on and off. A flip
 * sent twice undoes itself, so this reads the campaign's state first and
 * sends the PUT only when it differs from `enabled`.
 */
export const setCampaignEnabled: CorsairEndpoint<
	ProoflyContext,
	SetCampaignEnabledInput,
	SetCampaignEnabledResponse
> = async (ctx, input) => {
	const { campaign_id, enabled } = SetCampaignEnabledInputSchema.parse(input);
	const listBody = await prooflyGet<unknown>(ctx.key, '/campaigns');
	if (isProoflyFailure(listBody)) throw prooflyFailure('/campaigns', listBody);
	const campaign = ListCampaignsResponseSchema.parse(listBody).data.find(
		(item) => String(item.id) === campaign_id,
	);
	if (!campaign) {
		throw new Error(`Proofly campaign ${campaign_id} was not found`);
	}
	let result: SetCampaignEnabledResponse;
	if (campaign.enabled === enabled) {
		result = { campaign_id, enabled, changed: false };
	} else {
		const path = `/campaign/${encodeURIComponent(campaign_id)}`;
		const body = await prooflyRequest<unknown>(ctx.key, 'PUT', path);
		if (isProoflyFailure(body)) throw prooflyFailure(path, body, 'PUT');
		// unknown: the success body is `{ ok, status, data: "Campaign successfully enabled" }`.
		const message = (body as { data?: unknown } | null)?.data;
		result = {
			campaign_id,
			enabled,
			changed: true,
			...(typeof message === 'string' ? { message } : {}),
		};
	}
	const parsed = SetCampaignEnabledResponseSchema.parse(result);
	await logEventFromContext(
		ctx,
		'proofly.campaigns.setEnabled',
		{ campaign_id, enabled, changed: parsed.changed },
		'completed',
	);
	return parsed;
};

/**
 * GET /data/{notification_id}: leads and conversions a notification
 * collected. Entries hold what visitors typed (often an email), their IP and
 * location, so nothing is stored and events log only the count.
 */
export const getNotificationData: CorsairEndpoint<
	ProoflyContext,
	GetNotificationDataInput,
	GetNotificationDataResponse
> = async (ctx, input) => {
	const { notification_id } = GetNotificationDataInputSchema.parse(input);
	const path = `/data/${encodeURIComponent(notification_id)}`;
	const body = await prooflyGet<unknown>(ctx.key, path);
	if (isProoflyFailure(body)) throw prooflyFailure(path, body);
	const result = GetNotificationDataResponseSchema.parse(body);
	await logEventFromContext(
		ctx,
		'proofly.notifications.getData',
		{ notification_id, count: result.data.length },
		'completed',
	);
	return result;
};
