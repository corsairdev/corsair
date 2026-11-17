import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import {
	isProoflyFailure,
	prooflyFailure,
	prooflyGet,
	prooflyRequest,
} from '../client';
import type { ProoflyContext } from '../context';
import { storeCampaigns } from './campaigns';
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
	ToggleCampaignResponseSchema,
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
// One read-and-flip at a time per key and campaign: two overlapping calls
// that both saw "on" would each flip, and the second would undo the first.
const flipsInFlight = new Map<string, Promise<unknown>>();

async function readCampaigns(ctx: ProoflyContext) {
	// unknown: checked for `ok: false`, then parsed by the response schema.
	const body = await prooflyGet<unknown>(ctx.key, '/campaigns');
	if (isProoflyFailure(body)) throw prooflyFailure('/campaigns', body);
	return ListCampaignsResponseSchema.parse(body).data;
}

export const setCampaignEnabled: CorsairEndpoint<
	ProoflyContext,
	SetCampaignEnabledInput,
	SetCampaignEnabledResponse
> = async (ctx, input) => {
	const { campaign_id, enabled } = SetCampaignEnabledInputSchema.parse(input);
	const lock = `${ctx.key}:${campaign_id}`;
	const previous = flipsInFlight.get(lock) ?? Promise.resolve();
	const run = previous
		.catch(() => undefined)
		.then(() => applyEnabled(ctx, campaign_id, enabled));
	flipsInFlight.set(lock, run);
	try {
		return await run;
	} finally {
		if (flipsInFlight.get(lock) === run) flipsInFlight.delete(lock);
	}
};

async function applyEnabled(
	ctx: ProoflyContext,
	campaign_id: string,
	enabled: boolean,
): Promise<SetCampaignEnabledResponse> {
	const campaign = (await readCampaigns(ctx)).find(
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
		// unknown: checked for `ok: false`, then parsed by the response schema.
		const body = await prooflyRequest<unknown>(ctx.key, 'PUT', path);
		if (isProoflyFailure(body)) throw prooflyFailure(path, body, 'PUT');
		const reply = ToggleCampaignResponseSchema.parse(body);
		// Read the state back: a change made elsewhere at the same moment would
		// leave the campaign in the other state, and the caller must know.
		const after = (await readCampaigns(ctx)).find(
			(item) => String(item.id) === campaign_id,
		);
		if (after) await storeCampaigns(ctx, [after]);
		if (after?.enabled !== enabled) {
			throw new Error(
				`Proofly campaign ${campaign_id} is ${after?.enabled ? 'on' : 'off'} after the change; it was changed elsewhere at the same time`,
			);
		}
		result = { campaign_id, enabled, changed: true, message: reply.data };
	}
	const parsed = SetCampaignEnabledResponseSchema.parse(result);
	await logEventFromContext(
		ctx,
		'proofly.campaigns.setEnabled',
		{ campaign_id, enabled, changed: parsed.changed },
		'completed',
	);
	return parsed;
}

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
