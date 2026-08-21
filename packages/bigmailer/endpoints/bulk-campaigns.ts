import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerBulkCampaignEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'bulk campaign';

/** A campaign's `id` is only unique *within* its brand. Composite `brand:id` key. */
const entityId = (c: { brandId?: string; id: string }) =>
	`${c.brandId}:${c.id}`;

/**
 * Turns the shared `{from, replyTo, ...}` camelCase input shape into the
 * snake_case body BigMailer expects. `from`/`replyTo` are passed through
 * as-is (already `{email, name}`, the shape the API itself uses) rather
 * than renamed field by field.
 */
function campaignBody(input: {
	name?: string;
	subject?: string;
	from?: { email: string; name?: string };
	recipientName?: string;
	replyTo?: { email: string; name?: string };
	linkParams?: string;
	preview?: string;
	autoText?: boolean;
	html?: string;
	text?: string;
	templateId?: string;
	trackOpens?: boolean;
	trackClicks?: boolean;
	trackTextClicks?: boolean;
	segmentId?: string;
	messageTypeId?: string;
	listIds?: string[];
	excludedListIds?: string[];
	scheduledFor?: number;
	throttlingType?: 'none' | 'burst';
	throttlingAmount?: number;
	throttlingPeriod?: 900 | 1800 | 3600 | 7200;
	suppressionListId?: string;
	ready?: boolean;
}) {
	return compact({
		name: input.name,
		subject: input.subject,
		from: input.from,
		recipient_name: input.recipientName,
		reply_to: input.replyTo,
		link_params: input.linkParams,
		preview: input.preview,
		auto_text: input.autoText,
		html: input.html,
		text: input.text,
		template_id: input.templateId,
		track_opens: input.trackOpens,
		track_clicks: input.trackClicks,
		track_text_clicks: input.trackTextClicks,
		segment_id: input.segmentId,
		message_type_id: input.messageTypeId,
		list_ids: input.listIds,
		excluded_list_ids: input.excludedListIds,
		scheduled_for: input.scheduledFor,
		throttling_type: input.throttlingType,
		throttling_amount: input.throttlingAmount,
		throttling_period: input.throttlingPeriod,
		suppression_list_id: input.suppressionListId,
		ready: input.ready,
	});
}

/** Lists bulk (marketing) campaigns within a brand. */
export const list: BigmailerEndpoints['bulkCampaignsList'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['bulkCampaignsList']
	>(ctx, `brands/${seg(input.brandId)}/bulk-campaigns`, {
		query: compact({ limit: input.limit, cursor: input.cursor }),
	});

	await cacheEntities(
		ctx.db.bulkCampaigns,
		BigmailerBulkCampaignEntity,
		result.data.map((c) => ({ ...c, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.bulkCampaigns.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};

/**
 * Creates a bulk campaign. Left in draft (not sent or scheduled) unless the
 * caller explicitly sets `ready: true` - see `endpoints/types.ts`'s
 * `BulkCampaignWritableFields.ready` doc comment.
 */
export const create: BigmailerEndpoints['bulkCampaignsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['bulkCampaignsCreate']
	>(ctx, `brands/${seg(input.brandId)}/bulk-campaigns`, {
		method: 'POST',
		body: campaignBody(input),
	});

	await cacheEntity(
		ctx.db.bulkCampaigns,
		BigmailerBulkCampaignEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.bulkCampaigns.create',
		auditPayload(input, ['brandId', 'name', 'subject', 'ready']),
		'completed',
	);
	return result;
};

/** Retrieves a single bulk campaign, including its send metrics. */
export const get: BigmailerEndpoints['bulkCampaignsGet'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['bulkCampaignsGet']
	>(
		ctx,
		`brands/${seg(input.brandId)}/bulk-campaigns/${seg(input.campaignId)}`,
	);

	await cacheEntity(
		ctx.db.bulkCampaigns,
		BigmailerBulkCampaignEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.bulkCampaigns.get',
		auditPayload(input, ['brandId', 'campaignId']),
		'completed',
	);
	return result;
};

/**
 * Updates a bulk campaign. Confirmed live against a real account: `POST`,
 * not `PATCH`, at `/brands/{brand_id}/bulk-campaigns/{campaign_id}`. Setting
 * `ready: true` is what actually activates sending/scheduling - see
 * `endpoints/types.ts`'s `BulkCampaignWritableFields.ready` doc comment.
 */
export const update: BigmailerEndpoints['bulkCampaignsUpdate'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['bulkCampaignsUpdate']
	>(
		ctx,
		`brands/${seg(input.brandId)}/bulk-campaigns/${seg(input.campaignId)}`,
		{
			method: 'POST',
			body: campaignBody(input),
		},
	);

	await cacheEntity(
		ctx.db.bulkCampaigns,
		BigmailerBulkCampaignEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.bulkCampaigns.update',
		auditPayload(input, ['brandId', 'campaignId', 'ready']),
		'completed',
	);
	return result;
};
