import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { BigmailerTransactionalCampaignEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

const LABEL = 'transactional campaign';

/** A campaign's `id` is only unique *within* its brand. Composite `brand:id` key. */
const entityId = (c: { brandId?: string; id: string }) =>
	`${c.brandId}:${c.id}`;

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
	messageTypeId?: string;
	listId?: string;
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
		message_type_id: input.messageTypeId,
		list_id: input.listId,
		ready: input.ready,
	});
}

/** Lists transactional campaigns within a brand. */
export const list: BigmailerEndpoints['transactionalCampaignsList'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['transactionalCampaignsList']
	>(ctx, `brands/${seg(input.brandId)}/transactional-campaigns`, {
		query: compact({ limit: input.limit, cursor: input.cursor }),
	});

	await cacheEntities(
		ctx.db.transactionalCampaigns,
		BigmailerTransactionalCampaignEntity,
		result.data.map((c) => ({ ...c, brandId: input.brandId })),
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.transactionalCampaigns.list',
		{ ...auditPayload(input, ['brandId']), returned: result.data.length },
		'completed',
	);
	return result;
};

/**
 * Creates a transactional campaign. Left inactive unless the caller
 * explicitly sets `ready: true` - "The campaign will not be sent or
 * scheduled until activated by setting ready to true," confirmed live from
 * `updatetransactionalcampaign.md`.
 */
export const create: BigmailerEndpoints['transactionalCampaignsCreate'] =
	async (ctx, input) => {
		const result = await bigmailerCall<
			BigmailerEndpointOutputs['transactionalCampaignsCreate']
		>(ctx, `brands/${seg(input.brandId)}/transactional-campaigns`, {
			method: 'POST',
			body: campaignBody(input),
		});

		await cacheEntity(
			ctx.db.transactionalCampaigns,
			BigmailerTransactionalCampaignEntity,
			{ ...result, brandId: input.brandId },
			{ label: LABEL, entityId },
		);
		await logEventFromContext(
			ctx,
			'bigmailer.transactionalCampaigns.create',
			auditPayload(input, ['brandId', 'name', 'subject', 'ready']),
			'completed',
		);
		return result;
	};

/** Retrieves a single transactional campaign, including its send metrics. */
export const get: BigmailerEndpoints['transactionalCampaignsGet'] = async (
	ctx,
	input,
) => {
	const result = await bigmailerCall<
		BigmailerEndpointOutputs['transactionalCampaignsGet']
	>(
		ctx,
		`brands/${seg(input.brandId)}/transactional-campaigns/${seg(input.campaignId)}`,
	);

	await cacheEntity(
		ctx.db.transactionalCampaigns,
		BigmailerTransactionalCampaignEntity,
		{ ...result, brandId: input.brandId },
		{ label: LABEL, entityId },
	);
	await logEventFromContext(
		ctx,
		'bigmailer.transactionalCampaigns.get',
		auditPayload(input, ['brandId', 'campaignId']),
		'completed',
	);
	return result;
};

/**
 * Updates a transactional campaign. Confirmed live against a real account:
 * `POST`, not `PATCH`. Setting `ready: true` is what activates sending.
 */
export const update: BigmailerEndpoints['transactionalCampaignsUpdate'] =
	async (ctx, input) => {
		const result = await bigmailerCall<
			BigmailerEndpointOutputs['transactionalCampaignsUpdate']
		>(
			ctx,
			`brands/${seg(input.brandId)}/transactional-campaigns/${seg(input.campaignId)}`,
			{ method: 'POST', body: campaignBody(input) },
		);

		await cacheEntity(
			ctx.db.transactionalCampaigns,
			BigmailerTransactionalCampaignEntity,
			{ ...result, brandId: input.brandId },
			{ label: LABEL, entityId },
		);
		await logEventFromContext(
			ctx,
			'bigmailer.transactionalCampaigns.update',
			auditPayload(input, ['brandId', 'campaignId', 'ready']),
			'completed',
		);
		return result;
	};
