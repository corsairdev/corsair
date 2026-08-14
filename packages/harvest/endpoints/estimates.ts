import { logEventFromContext } from 'corsair/core';
import type { HarvestEndpoints } from '../index';
import { HarvestEstimateEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntity, evictEntity } from './persist';
import { compactBody, compactQuery, harvestCall } from './shared';
import type { HarvestEndpointOutputs } from './types';

const LABEL = 'estimate';

/* -------------------------------------------------------------------------- */
/*                                  Estimates                                  */
/* -------------------------------------------------------------------------- */

/** Retrieves one estimate, including its line items. */
export const get: HarvestEndpoints['estimatesGet'] = async (ctx, input) => {
	const result = await harvestCall<HarvestEndpointOutputs['estimatesGet']>(
		ctx,
		`estimates/${input.estimate_id}`,
	);

	await cacheEntity(ctx.db.estimates, HarvestEstimateEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.estimates.get',
		auditPayload(input, ['estimate_id']),
		'completed',
	);
	return result;
};

/**
 * Creates an estimate.
 *
 * The estimate is created as a draft; nothing reaches the client until an
 * estimate message with `event_type: 'send'` is created for it.
 */
export const create: HarvestEndpoints['estimatesCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['estimatesCreate']>(
		ctx,
		'estimates',
		{
			method: 'POST',
			body: compactBody({
				client_id: input.client_id,
				subject: input.subject,
				notes: input.notes,
				number: input.number,
				purchase_order: input.purchase_order,
				currency: input.currency,
				issue_date: input.issue_date,
				tax: input.tax,
				tax2: input.tax2,
				discount: input.discount,
				line_items: input.line_items,
			}),
		},
	);

	await cacheEntity(ctx.db.estimates, HarvestEstimateEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.estimates.create',
		{
			client_id: input.client_id,
			estimate_id: result.id,
			line_items: input.line_items?.length ?? 0,
		},
		'completed',
	);
	return result;
};

/**
 * Updates an estimate.
 *
 * As with invoices, supplying `line_items` replaces the whole set rather than
 * merging into it.
 */
export const update: HarvestEndpoints['estimatesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<HarvestEndpointOutputs['estimatesUpdate']>(
		ctx,
		`estimates/${input.estimate_id}`,
		{
			method: 'PATCH',
			body: compactBody({
				client_id: input.client_id,
				subject: input.subject,
				notes: input.notes,
				number: input.number,
				purchase_order: input.purchase_order,
				currency: input.currency,
				issue_date: input.issue_date,
				tax: input.tax,
				tax2: input.tax2,
				discount: input.discount,
				line_items: input.line_items,
			}),
		},
	);

	await cacheEntity(ctx.db.estimates, HarvestEstimateEntity, result, {
		label: LABEL,
	});

	await logEventFromContext(
		ctx,
		'harvest.estimates.update',
		auditPayload(input, ['estimate_id', 'client_id']),
		'completed',
	);
	return result;
};

/** Deletes an estimate. */
export const remove: HarvestEndpoints['estimatesDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(ctx, `estimates/${input.estimate_id}`, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.estimates, input.estimate_id, LABEL);

	await logEventFromContext(
		ctx,
		'harvest.estimates.delete',
		auditPayload(input, ['estimate_id']),
		'completed',
	);
	return { success: true, id: input.estimate_id };
};

/* -------------------------------------------------------------------------- */
/*                              Estimate messages                              */
/* -------------------------------------------------------------------------- */

/** Lists the messages recorded against an estimate, most recent first. */
export const listMessages: HarvestEndpoints['estimateMessagesList'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<
		HarvestEndpointOutputs['estimateMessagesList']
	>(ctx, `estimates/${input.estimate_id}/messages`, {
		query: compactQuery({
			updated_since: input.updated_since,
			page: input.page,
			per_page: input.per_page,
		}),
	});

	await logEventFromContext(
		ctx,
		'harvest.estimates.listMessages',
		auditPayload(input, ['estimate_id', 'page', 'per_page']),
		'completed',
	);
	return result;
};

/**
 * Creates an estimate message, and sends it when no `event_type` is given.
 *
 * As with invoice messages, the absence of `event_type` is what reaches the
 * client. Supplying one runs a state event: `send` marks a draft estimate as
 * sent, and `accept`, `decline` and `re-open` move it through the rest of its
 * state machine.
 *
 * @see https://help.getharvest.com/api-v2/estimates-api/estimates/estimate-messages/
 */
export const createMessage: HarvestEndpoints['estimateMessagesCreate'] = async (
	ctx,
	input,
) => {
	const result = await harvestCall<
		HarvestEndpointOutputs['estimateMessagesCreate']
	>(ctx, `estimates/${input.estimate_id}/messages`, {
		method: 'POST',
		body: compactBody({
			event_type: input.event_type,
			subject: input.subject,
			body: input.body,
			send_me_a_copy: input.send_me_a_copy,
			recipients: input.recipients,
		}),
	});

	await logEventFromContext(
		ctx,
		'harvest.estimates.createMessage',
		{
			estimate_id: input.estimate_id,
			event_type: input.event_type,
			recipients: input.recipients?.length ?? 0,
		},
		'completed',
	);
	return result;
};

/** Deletes an estimate message. */
export const removeMessage: HarvestEndpoints['estimateMessagesDelete'] = async (
	ctx,
	input,
) => {
	await harvestCall<void>(
		ctx,
		`estimates/${input.estimate_id}/messages/${input.message_id}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'harvest.estimates.deleteMessage',
		auditPayload(input, ['estimate_id', 'message_id']),
		'completed',
	);
	return { success: true, id: input.message_id };
};

/* -------------------------------------------------------------------------- */
/*                          Estimate item categories                           */
/* -------------------------------------------------------------------------- */

/**
 * Creates an estimate item category.
 *
 * Categories name the `kind` of an estimate line item, so one must exist before
 * a line item can reference it.
 */
export const createItemCategory: HarvestEndpoints['estimateItemCategoriesCreate'] =
	async (ctx, input) => {
		const result = await harvestCall<
			HarvestEndpointOutputs['estimateItemCategoriesCreate']
		>(ctx, 'estimate_item_categories', {
			method: 'POST',
			body: { name: input.name },
		});

		await logEventFromContext(
			ctx,
			'harvest.estimates.createItemCategory',
			{ estimate_item_category_id: result.id },
			'completed',
		);
		return result;
	};

/** Renames an estimate item category. */
export const updateItemCategory: HarvestEndpoints['estimateItemCategoriesUpdate'] =
	async (ctx, input) => {
		const result = await harvestCall<
			HarvestEndpointOutputs['estimateItemCategoriesUpdate']
		>(ctx, `estimate_item_categories/${input.estimate_item_category_id}`, {
			method: 'PATCH',
			body: { name: input.name },
		});

		await logEventFromContext(
			ctx,
			'harvest.estimates.updateItemCategory',
			auditPayload(input, ['estimate_item_category_id']),
			'completed',
		);
		return result;
	};
